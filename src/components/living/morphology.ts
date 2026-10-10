// Catmull-Rom interpolation through an unbounded stream of seeded forms.
// Shared tangents carry movement across every segment, without a loop or reset.
export const CONTROL_COUNT = 6;
export const GENOME_SIZE = CONTROL_COUNT * 4 + 4;

const random = (frame: number, channel: number) => {
  const n = Math.sin(frame * 127.1 + channel * 311.7 + 17.8) * 43758.5453;
  return n - Math.floor(n);
};

export function genome(frame: number): Float32Array {
  const values = new Float32Array(GENOME_SIZE);
  const spreadX = 0.35 + random(frame, 1) * 1.25;
  const spreadY = 1.5 - random(frame, 1) * 0.95;
  const spreadZ = 0.15 + random(frame, 3) * 0.95;
  const winding = 1 + Math.floor(random(frame, 4) * 3);
  for (let i = 0; i < CONTROL_COUNT; i += 1) {
    const angle =
      (i / CONTROL_COUNT) * Math.PI * 2 + random(frame, i + 10) * 0.6;
    const radius = 0.48 + random(frame, i + 20) * 0.53;
    values[i * 4] =
      Math.cos(angle) * spreadX + (random(frame, i + 30) - 0.5) * 0.5;
    values[i * 4 + 1] =
      Math.sin(angle) * spreadY + (random(frame, i + 40) - 0.5) * 0.5;
    values[i * 4 + 2] =
      Math.sin(angle * winding + random(frame, 5) * 6) * spreadZ;
    values[i * 4 + 3] = radius;
  }
  values[24] = 1.55 + random(frame, 50) * 2.0; // cell size
  values[25] = random(frame, 51); // membrane topology
  values[26] = 0.03 + random(frame, 52) * 0.065; // membrane thickness
  values[27] = 0.24 + random(frame, 53) * 0.52; // fusion between lobes
  return values;
}

export function sampleMorphology(
  frames: Float32Array[],
  t: number,
  out: Float32Array,
) {
  const t2 = t * t;
  const t3 = t2 * t;
  const weights = [
    -0.5 * t3 + t2 - 0.5 * t,
    1.5 * t3 - 2.5 * t2 + 1,
    -1.5 * t3 + 2 * t2 + 0.5 * t,
    0.5 * t3 - 0.5 * t2,
  ];
  for (let i = 0; i < GENOME_SIZE; i += 1) {
    out[i] = frames.reduce(
      (value, frame, index) => value + frame[i]! * weights[index]!,
      0,
    );
  }
}
