import { IMAGE_UPLOAD_TARGET_BYTES } from '@/util/constants';

const MAX_IMAGE_DIMENSION = 2560;
const MIN_QUALITY = 0.6;
const MAX_ITERATIONS = 8;

export function isCompressibleImage(file: File | null | undefined): boolean {
  const t = String(file?.type || '').toLowerCase();
  if (!t.startsWith('image/')) return false;
  if (t === 'image/svg+xml') return false;
  if (t === 'image/gif') return false;
  return true;
}

function withExt(name: string | undefined, ext: string) {
  const base = String(name || 'image').replace(/\.[^/.]+$/, '');
  return `${base}.${ext}`;
}

async function loadImageElement(src: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image load error'));
    image.src = src;
  });
}

async function fileToBitmap(file: File, logStep: (label: string) => void) {
  if (typeof createImageBitmap === 'function') {
    try {
      logStep('fileToBitmap:createImageBitmap start');
      const bitmap = await createImageBitmap(file);
      logStep('fileToBitmap:createImageBitmap ok');
      return bitmap;
    } catch (error) {
      logStep(`fileToBitmap:createImageBitmap failed=${String(error)}`);
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    logStep('fileToBitmap:objectUrl load start');
    const image = await loadImageElement(objectUrl);
    logStep('fileToBitmap:objectUrl load ok');
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b || null),
      type,
      typeof quality === 'number' ? quality : undefined,
    );
  });
}

function getInitialScale(width: number, height: number, fileSize: number, targetBytes: number) {
  const dimensionScale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));
  const byteScale =
    fileSize > targetBytes ? Math.min(1, Math.sqrt(targetBytes / fileSize) * 1.15) : 1;
  return Math.max(0.35, Math.min(dimensionScale, byteScale));
}

function getTryTypes(file: File) {
  const type = String(file.type || '').toLowerCase();
  if (type === 'image/png' || type === 'image/webp') return ['image/webp', 'image/jpeg'];
  return ['image/jpeg', 'image/webp'];
}

export async function compressImageFile(
  file: File,
  targetBytes = IMAGE_UPLOAD_TARGET_BYTES,
): Promise<File | null> {
  if (!isCompressibleImage(file)) return null;

  const bitmap = await fileToBitmap(file, () => {});
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    const tryTypes = getTryTypes(file);
    let best: { blob: Blob; type: string } | null = null;

    let scale = getInitialScale(bitmap.width, bitmap.height, file.size, targetBytes);
    let quality = file.type === 'image/png' ? 0.86 : 0.82;

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const sw = Math.max(1, Math.round(bitmap.width * scale));
      const sh = Math.max(1, Math.round(bitmap.height * scale));
      canvas.width = sw;
      canvas.height = sh;
      ctx.clearRect(0, 0, sw, sh);
      ctx.drawImage(bitmap, 0, 0, sw, sh);

      for (const type of tryTypes) {
        const blob = await canvasToBlob(canvas, type, quality);
        if (!blob) continue;

        if (!best || blob.size < best.blob.size) {
          best = { blob, type };
        }
        if (blob.size <= targetBytes) {
          best = { blob, type };
          break;
        }
      }

      if (best && best.blob.size <= targetBytes) break;

      if (quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, quality - 0.08);
      } else {
        scale *= 0.85;
        if (scale < 0.35) break;
      }
    }

    if (!best) return null;

    const ext = best.type === 'image/webp' ? 'webp' : 'jpg';
    const newName = withExt(file.name, ext);
    return new File([best.blob], newName, { type: best.type });
  } finally {
    if ('close' in bitmap && typeof bitmap.close === 'function') {
      bitmap.close();
    }
  }
}
