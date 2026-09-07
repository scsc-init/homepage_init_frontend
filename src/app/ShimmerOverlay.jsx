'use client';

import { useEffect, useRef, useState } from 'react';

const SOURCE_DOT_PITCH = 20.7;
const MIN_COVERAGE = 0.04;
const FRAME_INTERVAL = 1000 / 30;

// 파동 상수
const WAVE_ANGLE = Math.PI / 4;
const WAVE_LENGTH = 30;
const WAVE_SPEED = 0.0016;
const PHASE_JITTER = 0.35;

const SWING_BASE = 0.4;
const SWING_BODY = 0.3;
const SWING_CREST = 0.6;
const MAX_SIZE_SWING = 1.05;

function extractDots(image) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  if (!w || !h) return null;

  const cols = Math.max(1, Math.round(w / SOURCE_DOT_PITCH));
  const rows = Math.max(1, Math.round(h / SOURCE_DOT_PITCH));

  const sampler = document.createElement('canvas');
  sampler.width = w;
  sampler.height = h;
  const sctx = sampler.getContext('2d', { willReadFrequently: true });
  if (!sctx) return null;
  sctx.drawImage(image, 0, 0);

  let pixels;
  try {
    pixels = sctx.getImageData(0, 0, w, h).data;
  } catch {
    return null;
  }

  const cellW = w / cols;
  const cellH = h / rows;
  const dots = [];

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

      const coverage = count ? sum / (count * 255) : 0;
      if (coverage < MIN_COVERAGE) continue;

      dots.push({
        col,
        row,
        size: Math.sqrt(coverage),
        alpha: 0.45 + 0.55 * coverage,
        phase: (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % (Math.PI * 2),
      });
    }
  }

  return { dots, cols, rows };
}

export default function ShimmerOverlay({ src, className, width, height, onReady }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let grid = null;
    let raf = 0;
    let lastFrame = 0;
    let visible = true;
    let cssW = 0;
    let cssH = 0;
    let dotColor = 'rgb(120,120,120)';
    let cancelled = false;

    const readDotColor = () => {
      dotColor = getComputedStyle(wrapper).color || dotColor;
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (grid && !raf) paint(0);
    };

    const paint = (time) => {
      const { dots, cols, rows } = grid;
      const cellW = cssW / cols;
      const cellH = cssH / rows;
      const maxDot = Math.min(cellW, cellH);
      const kx = (Math.cos(WAVE_ANGLE) * Math.PI * 2) / WAVE_LENGTH;
      const ky = (Math.sin(WAVE_ANGLE) * Math.PI * 2) / WAVE_LENGTH;
      const t = time * WAVE_SPEED;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = dotColor;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const s =
          0.5 + 0.5 * Math.sin(dot.col * kx + dot.row * ky - t + dot.phase * PHASE_JITTER);
        const crest = s * s * s;
        const swing = SWING_BASE + SWING_BODY * s + SWING_CREST * crest;

        const side = maxDot * dot.size * Math.min(swing, MAX_SIZE_SWING);
        if (side < 0.35) continue;

        ctx.globalAlpha = Math.min(1, dot.alpha * swing);
        ctx.fillRect(
          dot.col * cellW + (cellW - side) / 2,
          dot.row * cellH + (cellH - side) / 2,
          side,
          side,
        );
      }

      ctx.globalAlpha = 1;
    };

    const draw = (time) => {
      raf = requestAnimationFrame(draw);
      if (!grid || !visible || !cssW || !cssH) return;
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;
      paint(time);
    };

    const startAnimation = () => {
      if (cancelled || !grid || raf) return;
      raf = requestAnimationFrame(draw);
    };

    const stopAnimation = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const loader = new Image();
    loader.decoding = 'async';

    const onLoaded = () => {
      if (cancelled) return;
      grid = extractDots(loader);
      if (!grid || !grid.dots.length) return;

      readDotColor();
      resize();
      if (!cssW || !cssH) return;

      setReady(true);
      if (prefersReduced.matches) {
        paint(0);
      } else {
        startAnimation();
      }
      onReadyRef.current?.();
    };

    loader.addEventListener('load', onLoaded, { once: true });
    loader.addEventListener('error', () => {}, { once: true });
    loader.src = src;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(wrapper);

    const themeObserver = new MutationObserver(() => {
      readDotColor();
      if (grid && !raf && cssW && cssH) paint(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const onReducedChange = (event) => {
      if (!grid) return;
      if (event.matches) {
        stopAnimation();
        paint(0);
      } else {
        startAnimation();
      }
    };
    prefersReduced.addEventListener('change', onReducedChange);

    return () => {
      cancelled = true;
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      prefersReduced.removeEventListener('change', onReducedChange);
    };
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
      data-shimmer-ready={ready || undefined}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
