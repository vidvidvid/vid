import { useEffect, useRef } from "react";

import type { LivingMode } from "./LivingArtwork";
import styles from "./MenuDissolve.module.css";

type Props = {
  label: string;
  mode: LivingMode;
  active: boolean;
  paused: boolean;
};
type Grain = { x: number; y: number; u: number; v: number; seed: number };

const fraction = (value: number) => value - Math.floor(value);
const smoothstep = (low: number, high: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
};

export default function MenuDissolve({ label, mode, active, paused }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const latest = useRef({ active, paused });
  const wake = useRef<() => void>(() => {});
  latest.current = { active, paused };

  useEffect(() => {
    const surface = canvas.current;
    const row = surface?.closest<HTMLAnchorElement>("a");
    const lettering = row?.querySelector<HTMLElement>("[data-menu-label]");
    const context = surface?.getContext("2d");
    if (!surface || !row || !lettering || !context) return undefined;
    const mask = document.createElement("canvas");
    const ink = mask.getContext("2d", { willReadFrequently: true });
    if (!ink) return undefined;

    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    let width = 0;
    let height = 0;
    let grains: Grain[] = [];
    let progress = 0;
    let time = 0;
    let frame = 0;
    let previous = 0;
    let disposed = false;
    let pointer = 0.5;
    let pointerTarget = 0.5;
    let bounds = row.getBoundingClientRect();
    let letterColor = [236, 238, 242];

    const reset = () => {
      progress = 0;
      context.clearRect(0, 0, width, height);
      row.style.setProperty("--label-fade", "0");
      row.style.setProperty("--pattern-caption", "0");
      row.style.setProperty("--pattern-reveal", "0");
      delete row.dataset.patternReady;
    };

    const animate = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.04);
      previous = now;
      if (reduced || latest.current.paused || !grains.length) {
        reset();
        return;
      }
      const target = Number(latest.current.active);
      progress +=
        (target - progress) * (1 - Math.exp(-dt * (target ? 3.4 : 5.4)));
      if (!target && progress < 0.001) {
        reset();
        return;
      }
      time += dt;
      pointer += (pointerTarget - pointer) * (1 - Math.exp(-dt * 5));
      const reveal = smoothstep(0, 0.2, progress);
      const labelFade = smoothstep(0.015, 0.2, progress);
      row.dataset.patternReady = "true";
      row.style.setProperty("--label-fade", String(labelFade));
      row.style.setProperty("--pattern-reveal", String(reveal));
      row.style.setProperty(
        "--pattern-caption",
        String(smoothstep(0.55, 0.86, progress)),
      );
      const color = `rgb(${letterColor.map((channel, index) => Math.round(channel + ([7, 8, 10][index]! - channel) * reveal)).join(",")})`;
      row.style.setProperty("--pattern-ink", color);
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.globalAlpha = labelFade;
      context.beginPath();
      const left = width < 400 ? 32 : 42;
      const fieldWidth = width - left - 48;
      const fieldHeight = height * 0.68;
      const middle = height * 0.5;

      grains.forEach((grain, index) => {
        const { u, v, seed } = grain;
        const blend = smoothstep(
          0.08 + seed * 0.15,
          0.8 + seed * 0.17,
          progress,
        );
        let tx = 0;
        let ty = 0;
        let sizeX = 1.8;
        let sizeY = 1.8;
        if (mode === "code") {
          const lane = Math.floor(v * 9);
          const travel = fraction(u + time * (lane % 2 ? 0.065 : -0.045));
          tx = left + Math.round((travel * fieldWidth) / 8) * 8;
          ty = middle + ((lane - 4) * fieldHeight) / 9;
          ty += Math.sin(travel * 13 + time * 1.2 + pointer * 3) * 2.5;
          sizeX = 2 + (index % 7 === 0 ? 5 : 0) * blend;
          sizeY = 2 + (index % 5 === 0 ? 2 : 0) * blend;
        } else if (mode === "music") {
          const band = Math.floor(v * 11) - 5;
          tx = left + u * fieldWidth;
          const envelope = 0.55 + 0.45 * Math.sin(u * Math.PI);
          ty = middle + band * fieldHeight * 0.036;
          ty +=
            Math.sin(u * 16 + time * 2.1 + band * 0.14 + pointer * 4) *
            fieldHeight *
            0.27 *
            envelope;
          ty +=
            Math.sin(u * 8 - time * 1.15 + band * 0.24) * fieldHeight * 0.12;
          sizeX = 1.8 + blend * 1.3;
          sizeY = 1.8 - blend * 0.5;
        } else if (mode === "imagery") {
          const angle = u * Math.PI * 2;
          const ring = 0.25 + Math.floor(v * 13) / 17;
          const twist = Math.sin(angle * 3 + time * 0.8) * 0.16;
          tx = left + fieldWidth * (0.5 + (pointer - 0.5) * 0.1);
          tx += Math.cos(angle + twist) * fieldWidth * 0.48 * ring;
          ty = middle + Math.sin(angle) * fieldHeight * 0.48 * ring;
          ty +=
            Math.sin(angle * 4 - time * 1.2 + ring * 4) *
            fieldHeight *
            0.095 *
            ring;
          sizeX = 1.8 + blend * 0.7;
          sizeY = 1.8 - blend * 0.3;
        } else {
          const line = Math.floor(v * 8) - 3.5;
          const flow = u * Math.PI * 2 + time * 0.9 + pointer * 2;
          tx = left + u * fieldWidth + Math.sin(flow + line * 0.4) * 7;
          ty = middle + line * fieldHeight * 0.1;
          ty += Math.sin(flow + line * 0.55) * fieldHeight * 0.16;
          ty += Math.cos(u * 20 - time + line) * 3;
          sizeX = 1.8 + blend * (2 + seed * 4);
          sizeY = 1.8 - blend * 0.7;
        }
        // The same grains leave the letter mask and find their way home again.
        const scatter = Math.sin(blend * Math.PI) * (3 + seed * 12);
        const x =
          grain.x +
          (tx - grain.x) * blend +
          Math.sin(seed * 19 + time) * scatter;
        const y =
          grain.y +
          (ty - grain.y) * blend +
          Math.cos(seed * 23 - time) * scatter;
        context.rect(x - sizeX / 2, y - sizeY / 2, sizeX, sizeY);
      });
      context.fill();
      context.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };

    const schedule = () => {
      if (frame || disposed) return;
      previous = performance.now();
      frame = requestAnimationFrame(animate);
    };
    wake.current = schedule;

    const resize = () => {
      if (disposed || !row.isConnected) return;
      bounds = row.getBoundingClientRect();
      const surfaceBounds = surface.getBoundingClientRect();
      // Navigation and responsive layout can briefly leave a detached/empty box.
      if (surfaceBounds.width < 1 || surfaceBounds.height < 1) return;
      const textBounds = lettering.getBoundingClientRect();
      width = surfaceBounds.width;
      height = surfaceBounds.height;
      const ratio = Math.min(devicePixelRatio, 2);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const font = getComputedStyle(lettering);
      // Read the section's accent independently of its current hover color.
      ink.fillStyle = getComputedStyle(row).getPropertyValue("--accent").trim();
      const accent = ink.fillStyle;
      if (/^#[0-9a-f]{6}$/i.test(accent)) {
        letterColor = [1, 3, 5].map((offset) =>
          parseInt(accent.slice(offset, offset + 2), 16),
        );
      }
      ink.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      ink.letterSpacing = font.letterSpacing;
      ink.fillStyle = "#fff";
      const metrics = ink.measureText(label);
      const ascent =
        metrics.fontBoundingBoxAscent ?? parseFloat(font.fontSize) * 0.8;
      const descent =
        metrics.fontBoundingBoxDescent ?? parseFloat(font.fontSize) * 0.2;
      const baseline =
        textBounds.y -
        surfaceBounds.y +
        (parseFloat(font.lineHeight) - ascent - descent) / 2 +
        ascent;
      ink.fillText(label, textBounds.x - surfaceBounds.x, baseline);
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
      const next: Grain[] = [];
      const step = parseFloat(font.fontSize) < 60 ? 1.35 : 1.8;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (
            pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3]! < 100
          )
            continue;
          const index = next.length;
          next.push({
            x,
            y,
            u: fraction(index * 0.61803398875),
            v: fraction(index * 0.754877666),
            seed: fraction(Math.sin(index * 127.1 + 13.7) * 43758.5453),
          });
        }
      }
      grains = next;
      schedule();
    };
    const move = (event: PointerEvent) => {
      pointerTarget = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / width),
      );
    };
    const enter = () => {
      bounds = row.getBoundingClientRect();
    };
    const preferenceChange = () => {
      reduced = preference.matches;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(row);
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointermove", move, { passive: true });
    preference.addEventListener("change", preferenceChange);
    document.addEventListener("visibilitychange", schedule);
    resize();
    void document.fonts.ready.then(resize);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointermove", move);
      preference.removeEventListener("change", preferenceChange);
      document.removeEventListener("visibilitychange", schedule);
      wake.current = () => {};
      reset();
    };
  }, [label, mode]);

  useEffect(() => {
    wake.current();
  }, [active, paused]);

  return <canvas ref={canvas} className={styles.texture} aria-hidden="true" />;
}
