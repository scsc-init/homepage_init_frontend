import { IMAGE_UPLOAD_TARGET_BYTES } from '@/util/constants';

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

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(r.error || new Error('FileReader error'));
    r.readAsDataURL(file);
  });
}

async function dataUrlToBitmap(dataUrl: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return await createImageBitmap(blob);
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

export async function compressImageFile(
  file: File,
  targetBytes = IMAGE_UPLOAD_TARGET_BYTES,
): Promise<File | null> {
  if (!isCompressibleImage(file)) return null;

  const dataUrl = await fileToDataUrl(file);
  const bitmap = await dataUrlToBitmap(dataUrl);

  let w = bitmap.width;
  let h = bitmap.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const tryTypes = ['image/webp', 'image/jpeg'];
  let best: { blob: Blob; type: string } | null = null;

  let scale = 1.0;
  let quality = 0.92;

  for (let iter = 0; iter < 18; iter++) {
    const sw = Math.max(1, Math.round(w * scale));
    const sh = Math.max(1, Math.round(h * scale));
    canvas.width = sw;
    canvas.height = sh;
    ctx.clearRect(0, 0, sw, sh);
    ctx.drawImage(bitmap, 0, 0, sw, sh);

    for (const type of tryTypes) {
      const q = type === 'image/jpeg' ? Math.min(quality, 0.9) : quality;
      const blob = await canvasToBlob(canvas, type, q);

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

    if (quality > 0.55) {
      quality -= 0.08;
    } else {
      scale *= 0.88;
      if (scale < 0.35) break;
    }
  }

  bitmap.close?.();

  if (!best) return null;

  const ext = best.type === 'image/webp' ? 'webp' : 'jpg';
  const newName = withExt(file.name, ext);
  return new File([best.blob], newName, { type: best.type });
}
