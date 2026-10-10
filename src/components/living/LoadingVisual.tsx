import { useEffect, useId, useRef } from "react";

import styles from "./LoadingVisual.module.css";

export type LoaderVariant = "bloom" | "interference" | "assembly";

const TAU = Math.PI * 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const seed = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const BLOOM_START = 1.7;
const BLOOM_RINGS = 28;
const BLOOM_POINTS = 144;
const bloomRotation = (time: number) => Math.sin(time * 0.21) * 0.25 - 0.3;
const bloomOpacity = (depth: number) => 0.28 + Math.sin(depth * Math.PI) * 0.65;

function bloomPoint(depth: number, point: number, time: number) {
  const radius = 16 + depth * 83;
  const angle = (point / BLOOM_POINTS) * TAU;
  const wave =
    Math.sin(angle * 3 + time * 0.72 + depth * 2.3) * 0.13 +
    Math.cos(angle * 2 - time * 0.48 + depth * 3) * 0.12 +
    Math.sin(angle * 5 + time * 0.28 - depth * 2) * 0.035;
  const twist = angle + Math.sin(depth * 3 + time * 0.45) * 0.28;
  const breath = 1 + Math.sin(time * 0.9 - depth * 3) * 0.055;
  return [
    Math.cos(twist) * radius * (1 + wave) * breath,
    Math.sin(twist) * radius * (1 + wave) * 0.89,
  ] as const;
}

// The HTML artwork and the first canvas frame share the same geometry and phase.
const bloomFirstFrame = Array.from({ length: BLOOM_RINGS }, (_, ring) => {
  const depth = ring / (BLOOM_RINGS - 1);
  const path = Array.from({ length: BLOOM_POINTS }, (__, point) => {
    const [x, y] = bloomPoint(depth, point, BLOOM_START);
    return `${point ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join("");
  return { path: `${path}Z`, opacity: bloomOpacity(depth) };
});

function bloom(context: CanvasRenderingContext2D, time: number) {
  const glow = context.createRadialGradient(0, 0, 10, 0, 0, 115);
  glow.addColorStop(0, "#cfacff13");
  glow.addColorStop(0.65, "#9aadff09");
  glow.addColorStop(1, "#9aadff00");
  context.fillStyle = glow;
  context.fillRect(-125, -125, 250, 250);

  const color = context.createLinearGradient(-85, -75, 95, 80);
  color.addColorStop(0, "#9aadff");
  color.addColorStop(0.42, "#cfacff");
  color.addColorStop(0.72, "#ff9eaf");
  color.addColorStop(1, "#f6ce86");
  context.strokeStyle = color;
  context.lineWidth = 0.7;
  context.rotate(bloomRotation(time));

  for (let ring = 0; ring < BLOOM_RINGS; ring++) {
    const depth = ring / (BLOOM_RINGS - 1);
    context.globalAlpha = bloomOpacity(depth);
    context.beginPath();
    for (let point = 0; point < BLOOM_POINTS; point++) {
      const [x, y] = bloomPoint(depth, point, time);
      if (point === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();
  }
}

function interference(context: CanvasRenderingContext2D, time: number) {
  const color = context.createLinearGradient(-110, -55, 110, 65);
  color.addColorStop(0, "#9aadff");
  color.addColorStop(0.34, "#cfacff");
  color.addColorStop(0.67, "#ff9eaf");
  color.addColorStop(1, "#f6ce86");
  context.strokeStyle = color;
  context.lineWidth = 0.6;
  context.rotate(-0.26 + Math.sin(time * 0.24) * 0.14);
  context.globalCompositeOperation = "lighter";

  for (let layer = 0; layer < 2; layer++) {
    context.save();
    context.rotate(layer * (0.28 + Math.sin(time * 0.3) * 0.13));
    for (let line = 0; line < 52; line++) {
      const row = line / 51;
      context.globalAlpha =
        (0.23 + Math.sin(row * Math.PI) * 0.5) / (layer + 1);
      context.beginPath();
      for (let point = 0; point <= 100; point++) {
        const u = point / 100;
        const envelope = Math.pow(Math.sin(u * Math.PI), 0.7);
        const x = (u - 0.5) * 214;
        const y =
          (row - 0.5) * 124 * (0.45 + envelope * 0.55) +
          Math.sin(u * 8 - time * 0.85 + row * 3.4 + layer * 1.4) *
            32 *
            envelope +
          Math.cos(u * 13 + time * 0.6 - row * 2.3) * 9 * envelope;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
    context.restore();
  }
}

function assembly(context: CanvasRenderingContext2D, time: number) {
  const phase = (time % 5.8) / 5.8;
  const gather = smooth(Math.min(phase / 0.34, (1 - phase) / 0.27));
  const colors = ["#9aadff", "#ff9eaf", "#f6ce86"];
  context.fillStyle = "#959db8";
  context.globalAlpha = 0.1;
  for (let x = -108; x <= 108; x += 18) {
    for (let y = -90; y <= 90; y += 18) context.fillRect(x, y, 0.75, 0.75);
  }

  for (let letter = 0; letter < 3; letter++) {
    const left = -80 + letter * 40;
    context.strokeStyle = colors[letter]!;
    context.lineWidth = 0.65;
    context.globalAlpha = 0.12 + gather * 0.14;
    context.beginPath();
    context.moveTo(left, -39);
    context.lineTo(left + 31, 42);
    context.lineTo(left + 62, -39);
    context.stroke();
    context.fillStyle = colors[letter]!;
    for (let point = 0; point < 150; point++) {
      const id = point + letter * 150;
      const u = (point % 75) / 74;
      const side = point < 75;
      const tx =
        (side ? mix(left, left + 31, u) : mix(left + 31, left + 62, u)) +
        (seed(id + 4) - 0.5) * 4;
      const ty =
        (side ? mix(-39, 42, u) : mix(42, -39, u)) + (seed(id + 8) - 0.5) * 3;
      const angle = seed(id + 19) * TAU + time * (0.15 + seed(id) * 0.15);
      const radius = 30 + seed(id + 25) * 85;
      const local = smooth(gather * 1.35 - seed(id + 12) * 0.35);
      const arc = Math.sin(local * Math.PI) * 23;
      const x =
        mix(Math.cos(angle) * radius, tx, local) + Math.sin(angle) * arc;
      const y =
        mix(Math.sin(angle) * radius * 0.8, ty, local) - Math.cos(angle) * arc;
      const size = 0.9 + seed(id + 6) * 0.8;
      context.globalAlpha = 0.26 + local * 0.65;
      context.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
}

const drawings = { bloom, interference, assembly };

export default function LoadingVisual({ variant }: { variant: LoaderVariant }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return undefined;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let time =
      variant === "assembly" && !preference.matches ? 0.15 : BLOOM_START;
    let previous = 0;
    let inView = true;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const paint = (now: number) => {
      frame = 0;
      if (document.hidden || !inView || !width || !height) return;
      if (previous && !preference.matches)
        time += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      const scale = Math.min(width, height) / 280;
      context.scale(scale, scale);
      drawings[variant](context, time);
      context.restore();
      element.dataset.painted = "true";
      if (!preference.matches) frame = requestAnimationFrame(paint);
    };
    const wake = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      frame = requestAnimationFrame(paint);
    };
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(devicePixelRatio, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      wake();
    };
    const size = new ResizeObserver(resize);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      wake();
    });
    size.observe(element);
    visibility.observe(element);
    preference.addEventListener("change", wake);
    document.addEventListener("visibilitychange", wake);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      size.disconnect();
      visibility.disconnect();
      preference.removeEventListener("change", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [variant]);

  return (
    <div
      className={styles.visual}
      data-loader-variant={variant}
      aria-hidden="true"
    >
      {variant === "bloom" ? (
        <svg
          className={`${styles.fallback} ${styles.bloomFallback}`}
          viewBox="-140 -140 280 280"
          fill="none"
        >
          <defs>
            <linearGradient
              id={`${id}-color`}
              x1="-85"
              y1="-75"
              x2="95"
              y2="80"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`rotate(${(-bloomRotation(BLOOM_START) * 180) / Math.PI})`}
            >
              <stop stopColor="#9aadff" />
              <stop offset=".42" stopColor="#cfacff" />
              <stop offset=".72" stopColor="#ff9eaf" />
              <stop offset="1" stopColor="#f6ce86" />
            </linearGradient>
            <radialGradient
              id={`${id}-glow`}
              cx="0"
              cy="0"
              r="115"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".087" stopColor="#cfacff" stopOpacity={19 / 255} />
              <stop offset=".6804" stopColor="#9aadff" stopOpacity={9 / 255} />
              <stop offset="1" stopColor="#9aadff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect
            x="-125"
            y="-125"
            width="250"
            height="250"
            fill={`url(#${id}-glow)`}
          />
          <g
            stroke={`url(#${id}-color)`}
            strokeWidth=".7"
            transform={`rotate(${(bloomRotation(BLOOM_START) * 180) / Math.PI})`}
          >
            {bloomFirstFrame.map(({ path, opacity }) => (
              <path key={path} d={path} opacity={opacity} />
            ))}
          </g>
        </svg>
      ) : (
        <svg className={styles.fallback} viewBox="0 0 160 100" fill="none">
          <path d="M10 15 40 85 70 15" stroke="#9aadff" />
          <path d="M45 15 75 85 105 15" stroke="#ff9eaf" />
          <path d="M80 15 110 85 140 15" stroke="#f6ce86" />
        </svg>
      )}
      <canvas ref={canvas} />
    </div>
  );
}
