export const MANUAL_TAU = 0.05;

const RUN_STRETCH = 1.3;

const run = { active: false, from: 0, to: 0, begin: 0, duration: 1 };

const clock = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function beginButtonRun(fromScroll, toScroll, descentMs) {
  run.active = true;
  run.from = fromScroll;
  run.to = toScroll;
  run.begin = clock();
  run.duration = Math.max(1, descentMs * RUN_STRETCH);
}

export function cancelButtonRun() {
  run.active = false;
}

export function sampleRun(time) {
  if (!run.active) return null;
  const t = (time - run.begin) / run.duration;
  if (t >= 1) {
    run.active = false;
    return run.to;
  }
  return run.from + (run.to - run.from) * easeOutCubic(clamp01(t));
}
