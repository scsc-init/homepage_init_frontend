const WAVE_ANGLE = Math.PI / 4;
const WAVE_LENGTH = 30;
const WAVE_SPEED = 0.0016;
const PHASE_JITTER = 0.35;

const SWING_BASE = 0.4;
const SWING_BODY = 0.3;
const SWING_CREST = 0.6;

const KX = (Math.cos(WAVE_ANGLE) * Math.PI * 2) / WAVE_LENGTH;
const KY = (Math.sin(WAVE_ANGLE) * Math.PI * 2) / WAVE_LENGTH;

const TWO_PI = Math.PI * 2;
const LUT_SIZE = 2048;
const SIN_LUT = new Float32Array(LUT_SIZE);
for (let i = 0; i < LUT_SIZE; i++) SIN_LUT[i] = Math.sin((i / LUT_SIZE) * TWO_PI);

const fastSin = (x) => {
  const idx = (x * (LUT_SIZE / TWO_PI)) | 0;
  return SIN_LUT[((idx % LUT_SIZE) + LUT_SIZE) % LUT_SIZE];
};

export const MAX_SIZE_SWING = 1.05;

export function dotPhase(col, row) {
  return (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % (Math.PI * 2);
}

export function shimmerSwing(col, row, phase, timeMs) {
  const s =
    0.5 + 0.5 * fastSin(col * KX + row * KY - timeMs * WAVE_SPEED + phase * PHASE_JITTER);
  return SWING_BASE + SWING_BODY * s + SWING_CREST * (s * s * s);
}
