import { useEffect, useRef } from "react";
import * as THREE from "three";

import {
  CONTROL_COUNT,
  genome,
  GENOME_SIZE,
  sampleMorphology,
} from "./morphology";
import { fragmentShader, vertexShader } from "./organismShader";

export type LivingMode = "code" | "music" | "imagery" | "words";
type Props = {
  mode: LivingMode;
  activeMode: LivingMode | null;
  paused: boolean;
  variation: number;
  onReshape: () => void;
};

export default function LivingArtwork({
  mode,
  activeMode,
  paused,
  variation,
  onReshape,
}: Props) {
  const host = useRef<HTMLButtonElement>(null);
  const latest = useRef({ mode, activeMode, paused, variation, onReshape });
  latest.current = { mode, activeMode, paused, variation, onReshape };

  useEffect(() => {
    const element = host.current;
    if (!element) return undefined;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      element.dataset.fallback = "true";
      return undefined;
    }
    const pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1.25), 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x07080a, 0);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uResolution: { value: new THREE.Vector2() },
      uNodes: {
        value: Array.from({ length: CONTROL_COUNT }, () => new THREE.Vector4()),
      },
      uStructure: { value: new THREE.Vector4() },
      uFlow: { value: new THREE.Vector2() },
      uBloom: { value: 0 },
      uPulse: { value: 10 },
      uEnergy: { value: 0 },
      uRotation: { value: new THREE.Vector2(-0.32, 0.15) },
      uTime: { value: 0 },
      uFraming: { value: 5.2 },
      uOpen: { value: 0 },
      uEyeOpen: { value: 1 },
      uIntent: { value: 0 },
      uSymbol: { value: new THREE.Vector4(1, 0, 0, 0) },
      uMode: { value: new THREE.Vector4(1, 0, 0, 0) },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    const sculpture = new THREE.Mesh(geometry, material);
    sculpture.frustumCulled = false;
    scene.add(sculpture);
    let needsRender = true;
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      renderer.setSize(bounds.width, bounds.height);
      uniforms.uResolution.value.set(bounds.width, bounds.height);
      needsRender = true;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    resize();
    let inView = true;
    const intersection = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
    });
    intersection.observe(element);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    const preferenceChange = () => {
      reduced = preference.matches;
      needsRender = true;
    };
    preference.addEventListener("change", preferenceChange);

    const rotation = new THREE.Vector2(-0.32, 0.15);
    const velocity = new THREE.Vector2();
    const lastPointer = new THREE.Vector2();
    const flowTarget = new THREE.Vector2();
    const flowVelocity = new THREE.Vector2();
    const force = new THREE.Vector2();
    const dragOrigin = new THREE.Vector2();
    let holdTime = 0;
    const ripple = () => {
      uniforms.uEnergy.value = Math.min(
        1.5,
        0.35 + holdTime * 0.25 + uniforms.uFlow.value.length() * 0.5,
      );
      uniforms.uPulse.value = 0;
    };
    const targetMode = new THREE.Vector4();
    const targetSymbol = new THREE.Vector4();
    let held = false;
    let pointerId: number | null = null;
    let downAt = 0;
    let travel = 0;
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointerId !== null) return;
      pointerId = event.pointerId;
      element.setPointerCapture(event.pointerId);
      lastPointer.set(event.clientX, event.clientY);
      held = true;
      holdTime = 0;
      dragOrigin.copy(lastPointer);
      downAt = performance.now();
      travel = 0;
      velocity.set(0, 0);
      element.dataset.held = "true";
      needsRender = true;
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - lastPointer.x;
      const dy = event.clientY - lastPointer.y;
      travel += Math.abs(dx) + Math.abs(dy);
      rotation.x += dx * 0.003;
      const scale = 4 / Math.max(element.clientWidth, 300);
      flowTarget
        .set(
          (event.clientX - dragOrigin.x) * scale,
          -(event.clientY - dragOrigin.y) * scale,
        )
        .clampLength(0, 1.8);
      rotation.y = Math.max(-1.4, Math.min(1.4, rotation.y + dy * 0.003));
      velocity.set(dx * 0.2, dy * 0.2).clampLength(0, 2.5);
      lastPointer.set(event.clientX, event.clientY);
      needsRender = true;
    };
    const release = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const tap =
        event.type === "pointerup" &&
        travel < 8 &&
        performance.now() - downAt < 240;
      held = false;
      pointerId = null;
      delete element.dataset.held;
      if (element.hasPointerCapture(event.pointerId))
        element.releasePointerCapture(event.pointerId);
      if (tap) latest.current.onReshape();
      else if (event.type === "pointerup") ripple();
      flowTarget.set(0, 0);
      needsRender = true;
    };
    const blur = () => {
      held = false;
      pointerId = null;
      velocity.set(0, 0);
      flowTarget.set(0, 0);
      delete element.dataset.held;
      needsRender = true;
    };
    const lostCapture = () => {
      if (pointerId !== null) blur();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (
        [
          " ",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ].includes(event.key)
      )
        event.preventDefault();
      if (event.key === " " && !event.repeat) {
        holdTime = 0;
        held = true;
        element.dataset.held = "true";
      }
      if (event.key === "Enter" && !event.repeat) latest.current.onReshape();
      if (event.key === "ArrowLeft") rotation.x -= 0.14;
      if (event.key === "ArrowRight") rotation.x += 0.14;
      if (event.key === "ArrowUp") rotation.y -= 0.14;
      if (event.key === "ArrowDown") rotation.y += 0.14;
      needsRender = true;
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        held = false;
        ripple();
        delete element.dataset.held;
        needsRender = true;
      }
    };
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerup", release);
    element.addEventListener("pointercancel", release);
    element.addEventListener("lostpointercapture", lostCapture);
    element.addEventListener("blur", blur);
    element.addEventListener("keydown", keyDown);
    element.addEventListener("keyup", keyUp);
    window.addEventListener("blur", blur);

    const home = element.closest<HTMLElement>("[data-living-home]");
    let age = 1.3;
    let genomeIndex = -1;
    let genomes: Float32Array[] = [];
    const morphology = new Float32Array(GENOME_SIZE);
    let previousVariation = latest.current.variation;
    let impulse = 0;
    let frame = 0;
    let last = performance.now();
    let lastKey = "";
    let wasStatic = false;
    let slowFrames = 0;
    let sampleFrames = 0;
    let sampleTime = 0;
    let eyeTime = 0;
    let nextBlink = 1.4;
    let blinkStarted = -1;
    let wasImagery = false;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const elapsed = (now - last) / 1000;
      const dt = Math.min(elapsed, 0.04);
      last = now;
      if (!inView || document.hidden) return;
      const state = latest.current;
      const still = state.paused || reduced;
      const key = `${state.mode}:${state.activeMode}:${state.variation}`;
      if (still && wasStatic && key === lastKey && !needsRender) return;
      if (state.variation !== previousVariation) {
        impulse = 1.4;
        previousVariation = state.variation;
        ripple();
        if (still) age += 0.85;
      }
      const smooth = still ? 1 : 1 - Math.exp(-dt * 3.8);
      const imagery = state.activeMode === "imagery";
      if (imagery && !wasImagery) {
        eyeTime = 0;
        nextBlink = 1.4;
        blinkStarted = -1;
        uniforms.uEyeOpen.value = 1;
      }
      wasImagery = imagery;
      if (reduced) uniforms.uEyeOpen.value = 1;
      if (!still && imagery) {
        eyeTime += dt;
        if (eyeTime >= nextBlink && blinkStarted < 0)
          blinkStarted = eyeTime;
        if (blinkStarted >= 0) {
          const blinkAge = eyeTime - blinkStarted;
          // A quick close, a short rest, then a softer reopening.
          uniforms.uEyeOpen.value =
            1 -
            THREE.MathUtils.smoothstep(blinkAge, 0, 0.14) +
            THREE.MathUtils.smoothstep(blinkAge, 0.22, 0.5);
          if (blinkAge >= 0.5) {
            blinkStarted = -1;
            nextBlink = eyeTime + 2.8 + Math.random() * 2.4;
          }
        }
      }
      if (!still) {
        uniforms.uTime.value += dt;
        age += dt * (0.12 + impulse);
        impulse *= Math.exp(-dt * 1.2);
        uniforms.uPulse.value += dt;
        if (held) holdTime += dt;
        // Damped elastic return: frame-rate independent, with a small overshoot.
        flowVelocity.addScaledVector(
          force.copy(flowTarget).sub(uniforms.uFlow.value),
          dt * 36,
        );
        flowVelocity.multiplyScalar(Math.exp(-dt * 7));
        uniforms.uFlow.value.addScaledVector(flowVelocity, dt);
        if (!held) {
          rotation.x += dt * (0.05 + velocity.x);
          rotation.y = Math.max(
            -1.4,
            Math.min(1.4, rotation.y + velocity.y * dt),
          );
          velocity.multiplyScalar(Math.exp(-dt * 5));
        }
      }
      targetMode.set(
        Number(state.mode === "code"),
        Number(state.mode === "music"),
        Number(state.mode === "imagery"),
        Number(state.mode === "words"),
      );
      uniforms.uMode.value.lerp(targetMode, smooth);
      uniforms.uIntent.value +=
        ((state.activeMode ? 1 : 0) - uniforms.uIntent.value) *
        (still ? 1 : 1 - Math.exp(-dt * 3.8));
      if (state.activeMode) {
        targetSymbol.set(
          Number(state.activeMode === "code"),
          Number(state.activeMode === "music"),
          Number(state.activeMode === "imagery"),
          Number(state.activeMode === "words"),
        );
        uniforms.uSymbol.value.lerp(targetSymbol, smooth);
      }
      uniforms.uRotation.value.lerp(
        rotation,
        still ? 1 : 1 - Math.exp(-dt * 8),
      );
      if (still) uniforms.uFlow.value.copy(flowTarget);
      const open = held
        ? still
          ? 1
          : THREE.MathUtils.smoothstep(holdTime, 0.15, 2.3)
        : 0;
      const bloom = held
        ? still
          ? 1
          : THREE.MathUtils.smoothstep(holdTime, 2, 5)
        : 0;
      uniforms.uOpen.value +=
        (open - uniforms.uOpen.value) *
        (still ? 1 : 1 - Math.exp(-dt * (held ? 2.0 : 0.9)));
      uniforms.uBloom.value +=
        (bloom - uniforms.uBloom.value) *
        (still ? 1 : 1 - Math.exp(-dt * (held ? 1.8 : 0.7)));

      const currentGenome = Math.floor(age);
      if (currentGenome !== genomeIndex) {
        genomeIndex = currentGenome;
        genomes = Array.from({ length: 4 }, (_, index) =>
          genome(currentGenome + index),
        );
      }
      sampleMorphology(genomes, age - currentGenome, morphology);
      uniforms.uNodes.value.forEach((node, index) =>
        node.fromArray(morphology, index * 4),
      );
      uniforms.uStructure.value.fromArray(morphology, 24);
      const extent = Math.max(
        ...uniforms.uNodes.value.map(
          (node) => Math.hypot(node.x, node.y, node.z) + node.w,
        ),
      );
      const framing =
        THREE.MathUtils.lerp(
          Math.max(4.8, extent * 2.48),
          4.7,
          uniforms.uIntent.value,
        ) +
        uniforms.uOpen.value * 0.5 +
        uniforms.uFlow.value.length() * 0.35;
      uniforms.uFraming.value +=
        (framing - uniforms.uFraming.value) *
        (still ? 1 : 1 - Math.exp(-dt * 2.5));
      if (home) {
        const t = uniforms.uTime.value;
        home.style.setProperty(
          "--drift",
          String(Math.sin(t * 0.48) * 0.5 + Math.sin(t * 0.31) * 0.5),
        );
        home.style.setProperty("--charge", String(uniforms.uOpen.value));
        home.dataset.paused = String(still);
      }
      renderer.render(scene, camera);
      element.dataset.ready = "true";
      needsRender = false;
      wasStatic = still;
      lastKey = key;
      if (!still && sampleFrames < 100) {
        sampleFrames += 1;
        sampleTime += Math.min(elapsed, 0.1);
        if (sampleFrames === 100 && process.env.NODE_ENV === "development")
          element.dataset.frameMs = String(Math.round(sampleTime * 10));
        if (elapsed > 0.045) slowFrames += 1;
        if (sampleFrames === 100 && slowFrames > 35) {
          renderer.setPixelRatio(Math.min(pixelRatio, 0.8));
          resize();
        }
      }
    };
    frame = requestAnimationFrame(animate);
    const contextLost = (event: Event) => {
      event.preventDefault();
      element.dataset.fallback = "true";
      delete element.dataset.ready;
    };
    const contextRestored = () => {
      delete element.dataset.fallback;
      needsRender = true;
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      preference.removeEventListener("change", preferenceChange);
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerup", release);
      element.removeEventListener("pointercancel", release);
      element.removeEventListener("lostpointercapture", lostCapture);
      element.removeEventListener("blur", blur);
      element.removeEventListener("keydown", keyDown);
      element.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", blur);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      geometry.dispose();

      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <button
      ref={host}
      className="living-artwork"
      aria-label="Interactive sculpture: drag to stretch, or use arrow keys to turn; hold or hold Space to open the form; tap or press Enter to reshape."
      title="Drag to stretch. Hold to open. Release to ripple."
    >
      <span className="artwork-fallback" aria-hidden="true" />
    </button>
  );
}
