type Point = [number, number];
export const CURSOR_SAMPLES = 24;

// Equal-length strokes let the same points flow between every cursor shape.
function stroke(points: Point[]) {
  const lengths = points
    .slice(1)
    .map((point, index) =>
      Math.hypot(point[0] - points[index]![0], point[1] - points[index]![1]),
    );
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const samples = new Float32Array(CURSOR_SAMPLES * 2);
  let segment = 0;
  let covered = 0;
  for (let i = 0; i < CURSOR_SAMPLES; i++) {
    const distance = (i / (CURSOR_SAMPLES - 1)) * total;
    while (
      segment < lengths.length - 1 &&
      covered + lengths[segment]! < distance
    ) {
      covered += lengths[segment]!;
      segment++;
    }
    const t = total ? (distance - covered) / lengths[segment]! : 0;
    const a = points[segment]!;
    const b = points[segment + 1] ?? a;
    samples[i * 2] = a[0] + (b[0] - a[0]) * t;
    samples[i * 2 + 1] = a[1] + (b[1] - a[1]) * t;
  }
  return { points: samples, opacity: total ? 1 : 0 };
}
function arc(
  rx: number,
  ry: number,
  from = 0,
  to = Math.PI * 2,
  x = 0,
  y = 0,
): Point[] {
  return Array.from({ length: 49 }, (_, i) => {
    const t = from + (i / 48) * (to - from);
    return [x + Math.cos(t) * rx, y + Math.sin(t) * ry];
  });
}
function shape(...paths: Point[][]) {
  return Array.from({ length: 3 }, (_, index) =>
    stroke(paths[index] ?? [[0, 0]]),
  );
}

export const cursorShapes = {
  free: shape(arc(15, 15), arc(1.4, 1.4, 0, Math.PI * 2, 15)),
  sculpture: shape(arc(17, 10), arc(10, 17)),
  link: shape([
    [-13, -13],
    [13, -13],
    [13, 13],
    [-13, 13],
    [-13, -13],
  ]),
  code: shape(
    [
      [-7, -11],
      [-17, 0],
      [-7, 11],
    ],
    [
      [7, -11],
      [17, 0],
      [7, 11],
    ],
    [
      [4, -14],
      [-4, 14],
    ],
  ),
  music: shape(
    [
      [-12, -8],
      [-12, 8],
    ],
    [
      [0, -16],
      [0, 16],
    ],
    [
      [12, -11],
      [12, 11],
    ],
  ),
  imagery: shape(
    [[-19, 0], ...arc(19, 12, Math.PI, Math.PI * 2)],
    arc(19, 12, 0, Math.PI),
    arc(5, 5),
  ),
  words: shape(
    [
      [-7, -7],
      [-14, -7],
      [-14, 1],
      [-7, 1],
      [-7, 5],
      [-13, 11],
    ],
    [
      [13, -7],
      [6, -7],
      [6, 1],
      [13, 1],
      [13, 5],
      [7, 11],
    ],
  ),
  reshape: shape(arc(14, 14, -0.6, Math.PI * 1.6), [
    [-3, -17],
    [5, -13],
    [0, -6],
  ]),
  pause: shape(
    [
      [-7, -13],
      [-7, 13],
    ],
    [
      [7, -13],
      [7, 13],
    ],
  ),
  play: shape([
    [-9, -14],
    [15, 0],
    [-9, 14],
    [-9, -14],
  ]),
  external: shape(
    [
      [-11, 11],
      [12, -12],
    ],
    [
      [-3, -12],
      [12, -12],
      [12, 3],
    ],
  ),
  home: shape(
    [
      [-17, -1],
      [0, -15],
      [17, -1],
    ],
    [
      [-11, -5],
      [-11, 13],
      [11, 13],
      [11, -5],
    ],
  ),
  expand: shape(
    [
      [-5, -15],
      [-15, -15],
      [-15, -5],
    ],
    [
      [5, 15],
      [15, 15],
      [15, 5],
    ],
    [
      [-10, 10],
      [10, -10],
    ],
  ),
  back: shape(
    [
      [15, 0],
      [-15, 0],
    ],
    [
      [-3, -12],
      [-15, 0],
      [-3, 12],
    ],
  ),
  forward: shape(
    [
      [-15, 0],
      [15, 0],
    ],
    [
      [3, -12],
      [15, 0],
      [3, 12],
    ],
  ),
  inspect: shape(arc(10, 10), [
    [7, 7],
    [16, 16],
  ]),
  disabled: shape(arc(14, 14), [
    [-10, 10],
    [10, -10],
  ]),
};

export type CursorShape = keyof typeof cursorShapes;
