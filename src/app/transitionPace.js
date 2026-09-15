export const MANUAL_TAU = 0.05;

const MAX_RATE_VH = 1.0;
const MAX_FRAME_S = 0.05;

const run = { active: false, from: 0, to: 0, begin: 0, duration: 1, at: 0, sampled: 0 };

const clock = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function beginButtonRun(fromScroll, toScroll, descentMs) {
  run.active = true;
  run.from = fromScroll;
  run.to = toScroll;
  run.begin = clock();
  run.duration = Math.max(1, descentMs);
  run.at = fromScroll;
  run.sampled = run.begin;
}

export function cancelButtonRun() {
  run.active = false;
}

export function sampleRun(time) {
  if (!run.active) return null;

  const t = (time - run.begin) / run.duration;
  const ideal = run.from + (run.to - run.from) * easeInOutCubic(clamp01(t));

  const dt = Math.min(MAX_FRAME_S, Math.max(0, (time - run.sampled) / 1000));
  run.sampled = time;

  const viewport = (typeof window !== 'undefined' && window.innerHeight) || 800;
  const step = ideal - run.at;
  const limit = MAX_RATE_VH * viewport * dt;
  run.at += Math.abs(step) > limit ? Math.sign(step) * limit : step;

  if (t >= 1 && Math.abs(run.to - run.at) < 0.5) {
    run.active = false;
    run.at = run.to;
  }
  return run.at;
}
