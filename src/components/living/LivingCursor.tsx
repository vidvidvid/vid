import { useEffect, useRef } from "react";

import { CURSOR_SAMPLES, type CursorShape,cursorShapes } from "./cursorShapes";
import styles from "./LivingCursor.module.css";

export default function LivingCursor() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return undefined;
    const point = element.querySelector<HTMLElement>("[data-point]")!;
    const orbit = element.querySelector<HTMLElement>("[data-orbit]")!;
    const tail = element.querySelector<HTMLElement>("[data-tail]")!;
    const ripple = element.querySelector<HTMLElement>("[data-ripple]")!;
    const paths = Array.from(
      element.querySelectorAll<SVGPathElement>("[data-orbit] path"),
    );
    const strokes = cursorShapes.free.map((path) => ({
      points: path.points.slice(),
      opacity: path.opacity,
    }));
    let currentShape: CursorShape = "free";
    let target: Element | null = null;
    const pointer = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let pressed = false;
    let interactive = false;
    let sculpture = false;
    let x = 0;
    let y = 0;
    let orbitX = 0;
    let orbitY = 0;
    let tailX = 0;
    let tailY = 0;
    let size = 1;
    let angle = 0;
    let time = 0;
    let last = 0;
    let frame = 0;
    let pulse: Animation | undefined;

    const hide = () => {
      visible = false;
      pressed = false;
      element.dataset.visible = "false";
      delete element.dataset.pressed;
      delete document.documentElement.dataset.livingCursor;
      cancelAnimationFrame(frame);
      pulse?.cancel();
    };
    const render = (now: number) => {
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      time += dt;
      const follow = 1 - Math.exp(-dt * 24);
      orbitX += (x - orbitX) * follow;
      orbitY += (y - orbitY) * follow;
      tailX += (orbitX - tailX) * (1 - Math.exp(-dt * 16));
      tailY += (orbitY - tailY) * (1 - Math.exp(-dt * 16));
      const dx = x - orbitX;
      const dy = y - orbitY;
      const speed = Math.hypot(dx, dy);
      const desiredAngle = interactive
        ? currentShape === "link"
          ? Math.PI / 4
          : 0
        : Math.atan2(dy, dx);
      if (speed > 0.5 || interactive)
        angle +=
          Math.atan2(
            Math.sin(desiredAngle - angle),
            Math.cos(desiredAngle - angle),
          ) * follow;
      const targetSize = pressed
        ? 0.55
        : sculpture
          ? 1.45
          : interactive
            ? 1.2
            : 0.8;
      size += (targetSize - size) * (1 - Math.exp(-dt * 16));
      const stretch = Math.min(speed / 90, 0.55);
      const breath = 1 + Math.sin(time * 2.8) * 0.035;
      const morph = 1 - Math.exp(-dt * 18);
      strokes.forEach((stroke, index) => {
        const destination = cursorShapes[currentShape][index]!;
        const wave =
          currentShape === "music"
            ? 0.82 + Math.sin(time * 4 + index * 1.8) * 0.22
            : 1;
        let d = "";
        for (let i = 0; i < CURSOR_SAMPLES; i++) {
          const a = i * 2;
          stroke.points[a] =
            stroke.points[a]! +
            (destination.points[a]! - stroke.points[a]!) * morph;
          stroke.points[a + 1] =
            stroke.points[a + 1]! +
            (destination.points[a + 1]! * wave - stroke.points[a + 1]!) * morph;
          d += `${i ? "L" : "M"}${stroke.points[a]!.toFixed(2)},${stroke.points[a + 1]!.toFixed(2)}`;
        }
        stroke.opacity += (destination.opacity - stroke.opacity) * morph;
        paths[index]!.setAttribute("d", d);
        paths[index]!.style.opacity = String(stroke.opacity);
      });
      point.style.transform = `translate3d(${x}px,${y}px,0)`;
      orbit.style.transform = `translate3d(${orbitX}px,${orbitY}px,0) rotate(${angle}rad) scale(${size * (1 + stretch) * breath},${(size / (1 + stretch)) * breath})`;
      tail.style.transform = `translate3d(${tailX}px,${tailY}px,0) scale(${Math.min(speed / 10, 1)})`;
      frame = requestAnimationFrame(render);
    };
    const updateTarget = (eventTarget: EventTarget | null) => {
      const node = eventTarget instanceof Element ? eventTarget : null;
      // Keep native text editing, embedded media and top-layer dialogs usable.
      if (
        !node ||
        node.closest(
          "input, textarea, select, [contenteditable]:not([contenteditable='false']), iframe, dialog",
        )
      ) {
        hide();
        return false;
      }
      sculpture = !!node.closest(".living-artwork");
      interactive =
        !sculpture &&
        !!node.closest("a, button, [role='button'], summary, label");
      target = node.closest(
        "[data-cursor], a, button, [role='button'], summary, label",
      );
      let nextShape: CursorShape = sculpture
        ? "sculpture"
        : interactive
          ? "link"
          : "free";
      if (target?.matches(":disabled, [aria-disabled='true']")) {
        nextShape = "disabled";
      } else if (target?.hasAttribute("data-cursor")) {
        const explicit = target.getAttribute("data-cursor")!;
        if (Object.prototype.hasOwnProperty.call(cursorShapes, explicit))
          nextShape = explicit as CursorShape;
      } else if (target instanceof HTMLAnchorElement) {
        const url = new URL(target.href, location.href);
        const section = url.pathname.replace(/^\/|\/$/g, "");
        if (
          url.origin === location.origin &&
          ["code", "music", "imagery", "words"].includes(section)
        )
          nextShape = section as CursorShape;
        else if (url.origin === location.origin && url.pathname === "/")
          nextShape = "home";
        else if (url.pathname.endsWith(".pdf")) nextShape = "words";
        else if (url.hostname === "github.com") nextShape = "code";
        else if (url.hostname === "soundcloud.com") nextShape = "music";
        else if (url.origin !== location.origin) nextShape = "external";
      }
      currentShape = nextShape;
      element.dataset.shape = nextShape;
      element.dataset.palette = nextShape;
      element.dataset.surface = target?.querySelector("[data-menu-label]")
        ? "pattern"
        : "plain";
      element.dataset.mode = sculpture
        ? "sculpture"
        : interactive
          ? "link"
          : "free";
      return true;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pointer.matches || motion.matches) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      if (!updateTarget(event.target)) return;
      if (!visible) {
        visible = true;
        orbitX = tailX = x;
        orbitY = tailY = y;
        element.dataset.visible = "true";
        document.documentElement.dataset.livingCursor = "true";
        last = performance.now();
        render(last);
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") hide();
      if (!visible || event.button !== 0) return;
      pressed = true;
      element.dataset.pressed = "true";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      pulse?.cancel();
      pulse = ripple.animate(
        [
          { transform: "scale(.25)", opacity: 0.8 },
          { transform: "scale(2)", opacity: 0 },
        ],
        { duration: 500, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    };
    const up = () => {
      pressed = false;
      delete element.dataset.pressed;
      if (visible) updateTarget(document.elementFromPoint(x, y));
    };
    const out = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key.startsWith("Arrow")) hide();
    };
    const scroll = () => {
      if (visible) updateTarget(document.elementFromPoint(x, y));
    };
    // Reflect controls that change under a stationary pointer, such as pause/play.
    const controls = new MutationObserver((records) => {
      if (visible && records.some((record) => record.target === target))
        scroll();
    });
    controls.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cursor", "disabled", "aria-disabled", "href"],
    });
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", hide);
    document.addEventListener("pointerout", out);
    document.addEventListener("keydown", key);
    document.addEventListener("scroll", scroll, true);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    pointer.addEventListener("change", hide);
    motion.addEventListener("change", hide);
    return () => {
      hide();
      controls.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("keydown", key);
      document.removeEventListener("scroll", scroll, true);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", hide);
      pointer.removeEventListener("change", hide);
      motion.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={host} className={styles.cursor} aria-hidden="true">
      <span className={styles.point} data-point>
        <i />
      </span>
      <span className={styles.orbit} data-orbit>
        <svg
          viewBox="-24 -24 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path />
          <path />
          <path />
        </svg>
      </span>
      <span className={styles.tail} data-tail />
      <span className={styles.ripple} data-ripple />
    </div>
  );
}
