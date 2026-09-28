export function sampleAlphaGrid(image, pitch) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  if (!w || !h) return null;

  const cols = Math.max(1, Math.round(w / pitch));
  const rows = Math.max(1, Math.round(h / pitch));

  const sampler = document.createElement('canvas');
  sampler.width = w;
  sampler.height = h;
  const ctx = sampler.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0);

  let pixels;
  try {
    pixels = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return null;
  }

  const cellW = w / cols;
  const cellH = h / rows;
  const coverage = new Float32Array(cols * rows);

  for (let row = 0; row < rows; row++) {
    const y0 = Math.floor(row * cellH);
    const y1 = Math.min(h, Math.ceil((row + 1) * cellH));
    for (let col = 0; col < cols; col++) {
      const x0 = Math.floor(col * cellW);
      const x1 = Math.min(w, Math.ceil((col + 1) * cellW));

      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        const rowOffset = y * w;
        for (let x = x0; x < x1; x++) {
          sum += pixels[(rowOffset + x) * 4 + 3];
          count++;
        }
      }
      coverage[row * cols + col] = count ? sum / (count * 255) : 0;
    }
  }

  return { cols, rows, coverage };
}

const gridCache = new Map();

export function loadDotGrid(src, pitch) {
  const key = `${src}@${pitch}`;
  const cached = gridCache.get(key);
  if (cached) return cached;

  const pending = new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(sampleAlphaGrid(image, pitch)), {
      once: true,
    });
    image.addEventListener('error', () => resolve(null), { once: true });
    image.src = src;
  });

  gridCache.set(key, pending);
  return pending;
}
