'use client';

import { useEffect, useRef } from 'react';
import { loadDotGrid } from './dotGrid';
import { MAX_SIZE_SWING, dotPhase, shimmerSwing } from './shimmer';
import { MANUAL_TAU, sampleRun } from './transitionPace';

const WALL_SOURCE = '/wall-logo.png';
const WALL_DOT_PITCH = 8;
const HERO_DOT_PITCH = 20.7;
const MIN_COVERAGE = 0.05;
const MAX_DPR = 1.25;

const SPLIT_START_RATIO = 0.12;
const SPLIT_SPAN_RATIO = 0.75;

const GRAIN_SPAN = 0.5;
const ROW_SPREAD = 0.16;
const GRAIN_JITTER = 0.06;
const FALL_VARIANCE = 0.45;
const LEAD_GAP = 0.22;
const GATHER_AT = 0.28;
const FALL_ACCEL = 0.32;
const DRIFT_X = 34;

const FALL_EASE_IN = 0.55;

const STRIP_ASPECT = 449 / 1290;
const FLOW_BOX_WIDTH_VW = 18;
const FLOW_BOX_HEIGHT_VW = 27;
const FLOWS = [
  { anchor: 'left', offsetVw: 5, centerVh: 22, speed: 0.86 },
  { anchor: 'right', offsetVw: 2, centerVh: 62, speed: 1.0 },
];

const FALL_SPEED = 96;
const EXIT_FADE_PX = 160;

const MIN_DOT_PX = 1.1;
const FLOW_GAIN = 2.1;

const ALPHA_STEPS = 32;

const SCROLL_DEADZONE_PX = 2;
const SETTLE_EPSILON_PX = 0.3;

const scrollOffset = () =>
  Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);
const settle = (v) => v * v * v * (v * (v * 6 - 15) + 10);

function toDots(grid) {
  if (!grid) return null;
  const { cols, rows, coverage } = grid;
  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cov = coverage[row * cols + col];
      if (cov < MIN_COVERAGE) continue;
      const phase = dotPhase(col, row);
      dots.push({
        col,
        row,
        cov,
        size: Math.sqrt(cov),
        phase,
        jitter: Math.abs(phase) / (Math.PI * 2),
      });
    }
  }
  return { dots, cols, rows, coverage };
}

export default function DigitalRain({ className }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let wall = null;
    let sources = [];
    let flows = [];
    let raf = 0;
    let lastTime = 0;
    let cssW = 0;
    let cssH = 0;
    let dotColor = 'rgb(120,120,120)';
    let heroGain = 1;
    let progress = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let cancelled = false;

    let buckets = Array.from({ length: ALPHA_STEPS }, () => new Path2D());
    const bucketUsed = new Uint8Array(ALPHA_STEPS);

    const pushRect = (alpha, x, y, side) => {
      const index = Math.min(ALPHA_STEPS - 1, Math.max(0, Math.round(alpha * ALPHA_STEPS) - 1));
      buckets[index].rect(x, y, side, side);
      bucketUsed[index] = 1;
    };

    const flushBuckets = () => {
      for (let i = 0; i < ALPHA_STEPS; i++) {
        if (!bucketUsed[i]) continue;
        ctx.globalAlpha = (i + 1) / ALPHA_STEPS;
        ctx.fill(buckets[i]);
        buckets[i] = new Path2D();
        bucketUsed[i] = 0;
      }
      ctx.globalAlpha = 1;
    };

    const readDotColor = () => {
      const style = getComputedStyle(wrapper);
      dotColor = style.color || dotColor;
      heroGain = parseFloat(style.getPropertyValue('--rain-hero-gain')) || 1;
    };

    const layoutFlows = () => {
      const vw = cssW / 100;
      const height = FLOW_BOX_HEIGHT_VW * vw;
      const width = height * STRIP_ASPECT;

      flows = FLOWS.map((flow) => {
        const boxRight =
          flow.anchor === 'left'
            ? (flow.offsetVw + FLOW_BOX_WIDTH_VW) * vw
            : cssW - flow.offsetVw * vw;
        const boxLeft = boxRight - FLOW_BOX_WIDTH_VW * vw;
        const top = (flow.centerVh / 100) * cssH - height / 2;
        return {
          xRight: boxRight - width,
          xLeft: boxLeft,
          top,
          width,
          height,
          fall: 0,
          cycle: 0,
          speed: flow.speed,
        };
      });

      const lowest = flows.reduce((a, b) => (a.top > b.top ? a : b));
      flows.forEach((flow) => {
        flow.lead = flow === lowest ? 0 : LEAD_GAP;
        flow.formStart = flow.lead + GRAIN_SPAN;
        flow.formEnd = flow.lead + ROW_SPREAD + GRAIN_JITTER + GRAIN_SPAN;
      });
    };

    const assignTargets = () => {
      if (!wall) return;
      const wallDots = wall.dots;
      sources.forEach((source, index) => {
        const flowIndex = Math.min(index, flows.length - 1);
        const flow = flows[flowIndex];
        if (!flow) return;
        const heroDots = source.grid.dots;
        source.flowIndex = flowIndex;

        const taken = new Set();
        heroDots.forEach((dot, i) => {
          const at = Math.floor((i * wallDots.length) / heroDots.length);
          dot.target = wallDots[at];
          taken.add(at);
        });

        source.fillers = [];
        for (let at = 0; at < wallDots.length; at++) {
          if (taken.has(at)) continue;
          const origin = heroDots[(at * 7919) % heroDots.length];
          if (origin) source.fillers.push({ origin, target: wallDots[at] });
        }
      });
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offset = scrollOffset();
      for (const source of sources) {
        const box = source.el.getBoundingClientRect();
        source.docTop = box.top + offset;
        source.left = box.left;
        source.width = box.width;
        source.height = box.height;
      }

      layoutFlows();
      assignTargets();
    };

    const readTarget = () => {
      const raw = scrollOffset();
      if (Math.abs(raw - targetScroll) > SCROLL_DEADZONE_PX || raw === 0) targetScroll = raw;
    };

    const advanceProgress = (dt, now) => {
      const previous = progress;
      const scripted = sampleRun(now);
      if (scripted !== null) {
        smoothScroll = scripted;
      } else if (dt <= 0) {
        smoothScroll = targetScroll;
      } else {
        smoothScroll += (targetScroll - smoothScroll) * (1 - Math.exp(-dt / MANUAL_TAU));
        if (Math.abs(targetScroll - smoothScroll) < SETTLE_EPSILON_PX)
          smoothScroll = targetScroll;
      }

      const vh = cssH || window.innerHeight || 1;
      progress = Math.max(0, (smoothScroll - SPLIT_START_RATIO * vh) / (SPLIT_SPAN_RATIO * vh));
      for (const source of sources) {
        source.top = source.docTop - smoothScroll;
      }

      return Math.abs(progress - previous) > 0.0004;
    };

    const isSettling = () => Math.abs(targetScroll - smoothScroll) > SETTLE_EPSILON_PX;

    const paintGrains = (time) => {
      const gatherAt = GATHER_AT;
      const fallDistance = cssH * FALL_ACCEL;

      for (const source of sources) {
        const { grid, flowIndex } = source;
        const flow = flows[flowIndex];
        if (!source.width || !flow) continue;

        const cellW = source.width / grid.cols;
        const cellH = source.height / grid.rows;
        const originDot = Math.min(cellW, cellH);
        const targetCellW = flow.width / wall.cols;
        const targetCellH = flow.height / wall.rows;
        const targetDot = Math.min(targetCellW, targetCellH);

        const logoTop = flow.top + flow.fall;
        const flowLeft = flow.cycle === 0 ? flow.xRight : flow.xLeft;

        const drawGrain = (dot, target, isFiller) => {
          const release =
            flow.lead + (1 - dot.row / grid.rows) * ROW_SPREAD + dot.jitter * GRAIN_JITTER;
          const local = clamp01((progress - release) / GRAIN_SPAN);

          const originX = source.left + (dot.col + 0.5) * cellW;
          const originY = source.top + (dot.row + 0.5) * cellH;

          let x = originX;
          let y = originY;
          let dotSide = originDot * dot.size;
          let gather = 0;

          if (local > 0) {
            if (!target) return;
            const freeX = originX + Math.sin(dot.phase) * DRIFT_X * local;
            const freeY =
              originY +
              local *
                local *
                fallDistance *
                (1 - FALL_VARIANCE / 2 + dot.jitter * FALL_VARIANCE);

            gather = settle(clamp01((local - gatherAt) / (1 - gatherAt)));
            const targetX = flowLeft + (target.col + 0.5) * targetCellW;
            const targetY = logoTop + (target.row + 0.5) * targetCellH;

            x = freeX + (targetX - freeX) * gather;
            y = freeY + (targetY - freeY) * gather;

            const endSide = targetDot * target.size;
            dotSide += (endSide - dotSide) * gather;
          }

          if (y < -dotSide || y > cssH + dotSide) return;

          const edge = Math.min(1, (cssH - y) / EXIT_FADE_PX);
          if (edge <= 0.02) return;

          const swing = shimmerSwing(dot.col, dot.row, dot.phase, time);
          const gain = heroGain + (FLOW_GAIN - heroGain) * gather;
          const shown = isFiller ? gather : 1;
          const alpha = Math.min(1, (0.45 + 0.55 * dot.cov) * swing * gain) * shown * edge;
          if (alpha <= 0.02) return;

          const drawn = Math.max(
            dotSide * Math.min(swing, MAX_SIZE_SWING),
            MIN_DOT_PX * gather,
          );
          pushRect(alpha, x - drawn / 2, y - drawn / 2, drawn);
        };

        for (const dot of grid.dots) drawGrain(dot, dot.target, false);
        for (const filler of source.fillers) drawGrain(filler.origin, filler.target, true);
      }
    };

    const paint = (time) => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = dotColor;
      paintGrains(time);
      flushBuckets();
    };

    const step = (time) => {
      raf = requestAnimationFrame(step);
      if (document.hidden || !cssW || !cssH || !wall) return;

      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      readTarget();
      const changed = advanceProgress(dt, time);

      let falling = false;
      for (const flow of flows) {
        const formed = clamp01((progress - flow.formStart) / (flow.formEnd - flow.formStart));
        if (formed <= 0) {
          flow.fall = 0;
          flow.cycle = 0;
          continue;
        }
        const ramp = smooth(Math.min(1, formed / FALL_EASE_IN));
        if (!prefersReduced.matches) {
          flow.fall += FALL_SPEED * flow.speed * ramp * dt;
          const period = cssH + flow.height;
          while (flow.top + flow.fall > cssH) {
            flow.fall -= period;
            flow.cycle = flow.cycle === 0 ? 1 : 0;
          }
        }
        falling = true;
      }

      const heroVisible = sources.some((s2) => s2.top + s2.height > 0 && s2.top < cssH);
      if (!heroVisible && !falling && !isSettling()) return;
      if (prefersReduced.matches && !changed && !falling) return;
      paint(time);
    };

    const collectSources = async () => {
      const elements = Array.from(document.querySelectorAll('[data-hero-dots]'));
      const loaded = await Promise.all(
        elements.map(async (el) => {
          const src = el.getAttribute('data-src');
          if (!src) return null;
          const grid = toDots(await loadDotGrid(src, HERO_DOT_PITCH));
          return grid
            ? {
                el,
                grid,
                flowIndex: 0,
                fillers: [],
                docTop: 0,
                top: 0,
                left: 0,
                width: 0,
                height: 0,
              }
            : null;
        }),
      );
      return loaded.filter(Boolean);
    };

    (async () => {
      const [wallGrid, heroSources] = await Promise.all([
        loadDotGrid(WALL_SOURCE, WALL_DOT_PITCH),
        collectSources(),
      ]);
      if (cancelled) return;

      wall = toDots(wallGrid);
      sources = heroSources;
      if (!wall || !sources.length) return;

      readDotColor();
      resize();
      if (!cssW || !cssH) return;
      readTarget();
      smoothScroll = targetScroll;
      advanceProgress(0, 0);
      paint(0);
      raf = requestAnimationFrame(step);
    })();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    const themeObserver = new MutationObserver(() => {
      readDotColor();
      if (prefersReduced.matches) paint(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
