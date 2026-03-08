/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Disable sRGB color management to preserve vivid colors from v0.150 behavior
THREE.ColorManagement.enabled = false;

const OBJECTS_PER_TYPE = 180;

// Shared hover state — set by index.tsx, read by useFrame loops
export const hoverState = { mode: null as string | null };

// Transition tracking — lerp factor for smooth mode changes
const transitionState = {
  prevMode: null as string | null,
  factor: 1,
  lastModeChange: 0,
};
const TRANSITION_DURATION = 2.0; // seconds to blend between modes
// Snapshot of positions at moment of mode change — blend FROM these
const snapshotPositions = new Float32Array(OBJECTS_PER_TYPE * 5 * 3);

// Shared position buffer for neural connections
const instancePositions = new Float32Array(OBJECTS_PER_TYPE * 5 * 3);

const getRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
  ] as [number, number, number];
};

const getRandomScale = () => {
  return Math.random() * 1.5 + 0.5;
};

const getRandomSpeed = () => {
  return Math.random() * 0.2 + 0.05;
};

// Mouse tracking state
const mouseState = { x: 0, y: 0 };

const MouseTracker = () => {
  const { viewport } = useThree();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseState.x =
        ((e.clientX / window.innerWidth) * 2 - 1) * viewport.width * 0.5;
      mouseState.y =
        (-(e.clientY / window.innerHeight) * 2 + 1) * viewport.height * 0.5;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [viewport]);

  return null;
};

// Auto-rotating camera
const AutoRotateCamera = () => {
  const { camera } = useThree();

  useFrame(() => {
    const { mode } = hoverState;
    const speedMap: Record<string, number> = { imagery: 1500, music: 2000, code: 4000 };
    const speed = (mode && speedMap[mode]) || 6000;
    const t = Date.now() / speed;
    camera.position.x = 25 * Math.sin(t);
    camera.position.z = 25 * Math.cos(t);
    camera.position.y = 10 * Math.sin(t * 0.7);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

type GeometryInstancesProps = {
  geometry: THREE.BufferGeometry;
  count: number;
  seed: number;
};

const GeometryInstances = ({
  geometry,
  count,
  seed,
}: GeometryInstancesProps) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const objectData = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: getRandomPosition(),
        scale: getRandomScale(),
        hue: Math.random(),
        speed: getRandomSpeed(),
        offset: seed * 1000 + i,
      })),
    [count, seed]
  );

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const { mode } = hoverState;
    const t = Date.now() / 1000;

    // Track mode transitions for smooth blending
    if (mode !== transitionState.prevMode) {
      transitionState.lastModeChange = t;
      transitionState.prevMode = mode;
      transitionState.factor = 0;
      // Snapshot current positions at moment of switch
      snapshotPositions.set(instancePositions);
    }
    const elapsed = t - transitionState.lastModeChange;
    transitionState.factor = Math.min(1, elapsed / TRANSITION_DURATION);
    // Smooth ease-in-out
    const blend =
      transitionState.factor < 0.5
        ? 2 * transitionState.factor * transitionState.factor
        : 1 - (-2 * transitionState.factor + 2) ** 2 / 2;

    objectData.forEach((obj, i) => {
      const { scale, speed, offset } = obj;
      const posBase = (seed * count + i) * 3;

      // Shared vars for words mode (needed by both position and color)
      let normalizedIdx = 0;
      let breathe = 0;

      if (mode === 'code') {
        // Neural network — objects cluster from their current position
        const curX = instancePositions[posBase] || obj.position[0];
        const curY = instancePositions[posBase + 1] || obj.position[1];
        const curZ = instancePositions[posBase + 2] || obj.position[2];
        dummy.position.set(curX, curY, curZ);
        dummy.position.y += Math.sin(t * 0.5 + offset) * 0.3 * scale;
        dummy.position.x += Math.cos(t * 0.5 + offset) * 0.3 * scale;
        dummy.rotation.x += speed * 0.5;
        dummy.rotation.y += speed * 0.5;
        dummy.scale.setScalar(scale * 0.8);
        // Stronger mouse attraction — clustering
        dummy.position.x += (mouseState.x - dummy.position.x) * 0.02;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.02;
      } else if (mode === 'music') {
        // APHEX TWIN MODE — 170 BPM breakcore drill'n'bass chaos
        const bpm = 170;
        const beatT = (t * bpm) / 60;
        const bar = beatT % 4;

        // Amen break-style kick — irregular pattern per bar
        // Pattern: x..x..x.x...x.x. (16th note grid, shifts each bar)
        const sixteenth = (beatT * 4) % 1;
        const stepInBar = Math.floor((bar * 4) % 16);
        const kickPattern = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0];
        // Second pattern overlaid offset for polyrhythm
        const kickPattern2 = [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1];
        const kickHit = kickPattern[stepInBar] || 0;
        const kickHit2 = kickPattern2[stepInBar] || 0;
        const kick =
          kickHit * Math.exp(-sixteenth * 12) * 1.5 +
          kickHit2 * Math.exp(-sixteenth * 16) * 0.8;

        // Chopped snare rolls — 32nd note bursts that come and go
        const thirtySecond = (beatT * 8) % 1;
        const rollWindow = Math.sin(beatT * 0.7) > 0.3 ? 1 : 0; // snare roll on/off
        const snarePattern = [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1];
        const snareHit = snarePattern[stepInBar] || 0;
        const snareRoll = rollWindow * Math.exp(-thirtySecond * 25) * 0.7;
        const snare = snareHit * Math.exp(-sixteenth * 14) * 1.3 + snareRoll;

        // Glitchy hi-hats — irregular 32nd notes with accents
        const hatAccent = Math.sin(beatT * 5.37 + offset * 0.1) > 0 ? 1.5 : 0.4;
        const hat = Math.exp(-thirtySecond * 30) * hatAccent;
        // Occasional open hat that rings out
        const openHatTrig = Math.sin(beatT * 1.13) > 0.7 ? 1 : 0;
        const hatOpen =
          openHatTrig * Math.exp(-((beatT * 2 + 0.5) % 1) * 4) * 0.8;

        // Acid bass — 5/8 polyrhythm against 4/4, slides and accents
        const acidBeat = (t * bpm * 5) / (60 * 8); // 5/8 time
        const acidPhase = (acidBeat * 2) % 1;
        const acidSlide = Math.exp(-acidPhase * 8) * 0.9;
        // Acid accent pattern
        const acidStep = Math.floor(acidBeat * 4) % 5;
        const acidAccents = [1.5, 0.5, 1.2, 0.3, 1.8];
        const acid = acidSlide * (acidAccents[acidStep] || 1);

        // Glitch stutter — random-feeling but deterministic chops
        const stutterSeed = Math.floor(beatT * 2);
        const stutterRate = 4 + ((stutterSeed * 7) % 5) * 4; // 4,8,12,16,20 subdivisions
        const stutterPhase = (beatT * stutterRate) % 1;
        const stutterOn = Math.sin(stutterSeed * 13.37) > 0 ? 1 : 0;
        const stutter = stutterOn * Math.exp(-stutterPhase * 20) * 0.6;

        // Per-object role assignment — 7 roles for more variety
        const role = (seed * count + i) % 7;
        let pulse = 0;
        let lateralPush = 0;
        let verticalBias = 1;
        let zPush = 0;
        if (role === 0) {
          // Kick smasher — massive vertical
          pulse = kick * 2;
          verticalBias = 2;
          zPush = kick * 3;
        } else if (role === 1) {
          // Snare snapper — lateral whip
          pulse = snare * 1.5;
          lateralPush = snare * 8;
          verticalBias = 0.5;
        } else if (role === 2) {
          // Hat swarm — frantic jitter in all axes
          pulse = (hat + hatOpen) * 1.2;
          lateralPush = hat * 5 * Math.sin(t * 20 + offset);
          zPush = hat * 4 * Math.cos(t * 17 + offset);
          verticalBias = 0.4;
        } else if (role === 3) {
          // Acid slider — smooth but aggressive, diagonal motion
          pulse = acid * 1.8;
          lateralPush = acid * 6 * Math.sin(acidBeat * Math.PI * 2);
          zPush = acid * 4 * Math.cos(acidBeat * Math.PI * 2);
        } else if (role === 4) {
          // Stutter glitcher — teleporting micro-jumps
          pulse = stutter * 2;
          lateralPush = stutter * 10 * ((stutterSeed % 3) - 1);
          zPush = stutter * 8 * ((stutterSeed % 5) - 2) * 0.5;
          verticalBias = 1.5;
        } else if (role === 5) {
          // Polyrhythm rider — responds to acid AND kick combined
          pulse = (kick + acid) * 1.2;
          lateralPush = (kick - acid) * 5;
          verticalBias = 1.3;
          zPush = Math.sin(beatT * 1.5) * acid * 4;
        } else {
          // Chaos absorber — everything at once, attenuated
          const everything =
            kick * 0.5 + snare * 0.4 + hat * 0.3 + acid * 0.4 + stutter * 0.3;
          pulse = everything * 1.5;
          lateralPush = everything * 3 * Math.sin(offset * 7 + t * 3);
          zPush = everything * 3 * Math.cos(offset * 11 + t * 2);
        }

        // Position from current location with rhythmic displacement
        const curMX = instancePositions[posBase] || obj.position[0];
        const curMY = instancePositions[posBase + 1] || obj.position[1];
        const curMZ = instancePositions[posBase + 2] || obj.position[2];
        dummy.position.set(curMX, curMY, curMZ);
        dummy.position.y += pulse * 5 * scale * verticalBias;
        dummy.position.x += lateralPush * scale * Math.sin(offset * 7);
        dummy.position.z +=
          lateralPush * scale * Math.cos(offset * 11) * 0.5 + zPush * scale;

        // Rotation — violent, synced to combined groove
        const totalGroove =
          kick + snare * 0.8 + hat * 0.5 + acid * 0.6 + stutter * 0.4;
        dummy.rotation.x += speed * (1 + totalGroove * 4);
        dummy.rotation.y += speed * (1 + pulse * 5);
        dummy.rotation.z += (hat * 0.6 + stutter * 0.8) * Math.sin(offset);

        // Scale — exaggerated squash-and-stretch
        const scaleBoost = 1 + kick * 1.2 + acid * 0.5 + stutter * 0.8;
        const squash = 1 + kick * 1.2 + snare * 0.6;
        dummy.scale.set(
          scale * scaleBoost * (1 / Math.sqrt(squash)),
          scale * scaleBoost * squash,
          scale * scaleBoost * (1 / Math.sqrt(squash))
        );

        dummy.position.x += (mouseState.x - dummy.position.x) * 0.015;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.015;
      } else if (mode === 'imagery') {
        // MELTING MORPHING MADNESS — shapes merge and flow into each other
        const now = Date.now();
        const chaos =
          Math.sin(now / 30 + offset * 7) * Math.cos(now / 50 + offset * 3);

        // Base organic motion — layered sine waves
        dummy.position.x =
          obj.position[0] +
          Math.sin(now / 40 + offset) * 10 +
          Math.sin(now / 17 + offset * 3) * 5 * chaos;
        dummy.position.y =
          obj.position[1] +
          Math.cos(now / 35 + offset * 2) * 10 +
          Math.cos(now / 23 + offset * 5) * 6 * chaos;
        dummy.position.z =
          obj.position[2] +
          Math.sin(now / 45 + offset * 4) * 10 +
          Math.sin(now / 19 + offset * 7) * 4;

        // Morphing: attract toward a neighbor to create merging blobs
        // Each object gravitates toward the next few objects cyclically
        const neighborIdx =
          (seed * count +
            i +
            1 +
            Math.floor(Math.sin(now / 500 + offset) * 3 + 3)) %
          (count * 5);
        const nx = instancePositions[neighborIdx * 3] || 0;
        const ny = instancePositions[neighborIdx * 3 + 1] || 0;
        const nz = instancePositions[neighborIdx * 3 + 2] || 0;
        // Pulsing merge strength — objects periodically rush toward each other then separate
        const mergeWave = Math.sin(now / 300 + offset * 2) * 0.5 + 0.5;
        const mergeStrength = 0.08 * mergeWave;
        dummy.position.x += (nx - dummy.position.x) * mergeStrength;
        dummy.position.y += (ny - dummy.position.y) * mergeStrength;
        dummy.position.z += (nz - dummy.position.z) * mergeStrength;

        // Melting: non-uniform scale that stretches TOWARD the neighbor (directional melt)
        const dx = nx - dummy.position.x;
        const dy = ny - dummy.position.y;
        const dz = nz - dummy.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        const proximity = Math.max(0, 1 - dist / 15); // 0 when far, 1 when close
        // When close to neighbor, stretch toward them (blob merge effect)
        const meltX =
          (0.3 + Math.abs(Math.sin(now / 80 + offset)) * 2.5) *
          (1 + ((proximity * Math.abs(dx)) / dist) * 2);
        const meltY =
          (0.3 + Math.abs(Math.cos(now / 60 + offset * 2)) * 2.5) *
          (1 + ((proximity * Math.abs(dy)) / dist) * 2);
        const meltZ =
          (0.3 + Math.abs(Math.sin(now / 100 + offset * 5)) * 2) *
          (1 + ((proximity * Math.abs(dz)) / dist) * 2);
        // Pulsing blob scale when merging
        const blobPulse = 1 + proximity * Math.sin(now / 100 + offset) * 0.8;
        dummy.scale.set(
          scale * meltX * blobPulse,
          scale * meltY * blobPulse,
          scale * meltZ * blobPulse
        );

        // Rotation: slow viscous rotation when merging, violent when apart
        const viscosity = 1 - proximity * 0.7;
        dummy.rotation.x +=
          (0.3 + Math.sin(now / 200 + offset) * 0.5) * viscosity;
        dummy.rotation.y +=
          (0.4 + Math.cos(now / 150 + offset) * 0.6) * viscosity;
        dummy.rotation.z += Math.sin(now / 100 + offset * 3) * 0.8 * viscosity;
        // When close, align rotation toward neighbor (morphing feel)
        if (proximity > 0.3) {
          dummy.rotation.x += Math.atan2(dy, dz) * proximity * 0.1;
          dummy.rotation.y += Math.atan2(dx, dz) * proximity * 0.1;
        }

        // Occasional teleport glitch
        if (Math.random() < 0.004) {
          dummy.position.x += (Math.random() - 0.5) * 30;
          dummy.position.y += (Math.random() - 0.5) * 30;
          dummy.position.z += (Math.random() - 0.5) * 30;
        }

        dummy.position.x += (mouseState.x - dummy.position.x) * 0.015;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.015;
      } else if (mode === 'words') {
        // Gravitational collapse — spiral inward, stretch, reform
        const totalIdx = seed * count + i;
        normalizedIdx = totalIdx / (OBJECTS_PER_TYPE * 5);
        const collapseSpeed = 0.3;
        const angle =
          normalizedIdx * Math.PI * 20 + t * (collapseSpeed + speed);
        breathe = Math.sin(t * 0.5) * 0.5 + 0.5;
        const baseRadius = 8 + normalizedIdx * 30;
        const radius = baseRadius * (0.3 + breathe * 0.7);
        // Scrolling height — objects continuously move upward and wrap around
        // so the vortex appears infinite with no visible top/bottom edge
        const vortexRange = 120;
        const rawHeight =
          ((normalizedIdx * vortexRange + t * 8) % vortexRange) -
          vortexRange / 2;
        dummy.position.x = Math.cos(angle) * radius;
        dummy.position.z = Math.sin(angle) * radius;
        dummy.position.y = rawHeight + Math.sin(t * 0.8 + totalIdx * 0.05) * 3;
        const stretchFactor = 1 + (1 - breathe) * 2;
        dummy.scale.set(scale * 0.6 * stretchFactor, scale * 0.6, scale * 0.6);
        dummy.rotation.y = angle + Math.PI / 2;
        dummy.rotation.x = t * 0.2;
        dummy.rotation.z = normalizedIdx * Math.PI;
      } else {
        // DEFAULT — calm floating
        dummy.position.set(...obj.position);
        dummy.rotation.x += speed * 0.3;
        dummy.rotation.y += speed * 0.3;
        dummy.rotation.z += speed * 0.15;
        dummy.position.y += Math.sin(t + offset) * 0.3 * scale;
        dummy.position.x += Math.cos(t + offset) * 0.3 * scale;
        dummy.scale.setScalar(scale);
        dummy.position.x += (mouseState.x - dummy.position.x) * 0.005;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.005;
      }

      // Smooth transition — blend from snapshot position toward new mode's live position
      if (blend < 1) {
        const snapX = snapshotPositions[posBase] || obj.position[0];
        const snapY = snapshotPositions[posBase + 1] || obj.position[1];
        const snapZ = snapshotPositions[posBase + 2] || obj.position[2];
        dummy.position.x = snapX + (dummy.position.x - snapX) * blend;
        dummy.position.y = snapY + (dummy.position.y - snapY) * blend;
        dummy.position.z = snapZ + (dummy.position.z - snapZ) * blend;
      }

      // Store position for neural connections
      instancePositions[posBase] = dummy.position.x;
      instancePositions[posBase + 1] = dummy.position.y;
      instancePositions[posBase + 2] = dummy.position.z;

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Color per mode
      if (mode === 'code') {
        const h = 0.3 + Math.sin(t * 0.5 + offset * 0.1) * 0.1;
        mesh.setColorAt(i, new THREE.Color().setHSL(h, 0.8, 0.5));
      } else if (mode === 'music') {
        // Aphex Twin colors — 7 roles, harsh contrasts, strobing
        const beatT2 = (t * 170) / 60;
        const sixteenth2 = (beatT2 * 4) % 1;
        const stepInBar2 = Math.floor(((beatT2 % 4) * 4) % 16);
        const role2 = (seed * count + i) % 7;
        let hue2 = 0;
        let sat2 = 1;
        let lum2 = 0.5;
        if (role2 === 0) {
          // Kick: blood red strobe
          const kickOn =
            [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0][stepInBar2] || 0;
          hue2 = 0.0;
          lum2 = 0.4 + kickOn * Math.exp(-sixteenth2 * 12) * 0.5;
          sat2 = 0.9;
        } else if (role2 === 1) {
          // Snare: white/electric blue crack
          const snareOn =
            [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1][stepInBar2] || 0;
          hue2 = 0.55;
          lum2 = 0.45 + snareOn * Math.exp(-sixteenth2 * 14) * 0.5;
          sat2 = 1 - snareOn * Math.exp(-sixteenth2 * 14) * 0.5;
        } else if (role2 === 2) {
          // Hat: gold/white rapid flutter
          const thirtySecond2 = (beatT2 * 8) % 1;
          hue2 = 0.12;
          lum2 = 0.5 + Math.exp(-thirtySecond2 * 30) * 0.4;
          sat2 = 0.7;
        } else if (role2 === 3) {
          // Acid: neon green/yellow that slides
          const acidBeat2 = (t * 170 * 5) / (60 * 8);
          hue2 = 0.25 + Math.sin(acidBeat2 * Math.PI * 2) * 0.1;
          lum2 = 0.5 + Math.exp(-((acidBeat2 * 2) % 1) * 8) * 0.4;
          sat2 = 1;
        } else if (role2 === 4) {
          // Stutter: magenta/cyan inversion glitch
          const stutterSeed2 = Math.floor(beatT2 * 2);
          hue2 = stutterSeed2 % 2 === 0 ? 0.85 : 0.5;
          lum2 = 0.5 + Math.sin(stutterSeed2 * 13.37) * 0.3;
          sat2 = 1;
        } else if (role2 === 5) {
          // Polyrhythm: orange/purple alternating
          hue2 = Math.floor(beatT2 * 3) % 2 === 0 ? 0.08 : 0.75;
          lum2 = 0.55 + Math.exp(-sixteenth2 * 10) * 0.3;
        } else {
          // Chaos: rapid hue cycling
          hue2 = (beatT2 * 0.5 + offset * 0.1) % 1;
          lum2 = 0.5 + Math.exp(-sixteenth2 * 15) * 0.4;
          sat2 = 0.9;
        }
        mesh.setColorAt(i, new THREE.Color().setHSL(hue2, sat2, lum2));
      } else if (mode === 'imagery') {
        // Morphing colors — smooth hue cycling with proximity-based blending
        const now = Date.now();
        const baseHue = (now / 800 + offset * 0.3) % 1;
        // Neighbor's hue bleeds in when close (color morphing)
        const neighborIdx2 = (seed * count + i + 1) % (count * 5);
        const nd = instancePositions[neighborIdx2 * 3] || 0;
        const ndist = Math.abs(
          nd - (instancePositions[(seed * count + i) * 3] || 0)
        );
        const colorBlend = Math.max(0, 1 - ndist / 12);
        const neighborHue = (now / 800 + (seed * count + i + 1) * 0.3) % 1;
        const finalHue =
          baseHue * (1 - colorBlend * 0.6) + neighborHue * colorBlend * 0.6;
        // Occasional white-hot flash
        const flash = Math.random() < 0.04;
        if (flash) {
          mesh.setColorAt(i, new THREE.Color(1, 1, 1));
        } else {
          const sat = 0.8 + colorBlend * 0.2;
          const lum =
            0.45 + Math.sin(now / 200 + offset) * 0.15 + colorBlend * 0.1;
          mesh.setColorAt(
            i,
            new THREE.Color().setHSL(finalHue, sat, lum)
          );
        }
      } else if (mode === 'words') {
        const h = 0.7 + normalizedIdx * 0.15;
        mesh.setColorAt(
          i,
          new THREE.Color().setHSL(h, 0.6, 0.4 + breathe * 0.2)
        );
      } else {
        const hue = (obj.hue + t * 0.02) % 1;
        mesh.setColorAt(i, new THREE.Color().setHSL(hue, 0.7, 0.5));
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]}>
      <meshBasicMaterial />
    </instancedMesh>
  );
};

const MovingLight = ({
  speed = 500,
  radius = 20,
  color = 0,
  yOffset = 0,
  intensity = 2,
}: {
  speed?: number;
  radius?: number;
  color?: number;
  yOffset?: number;
  intensity?: number;
}) => {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!light.current) return;
    light.current.position.x = radius * Math.sin(Date.now() / speed);
    light.current.position.z = radius * Math.cos(Date.now() / speed);
    light.current.position.y =
      yOffset + 10 * Math.sin(Date.now() / (speed * 1.5));
    light.current.color.setHSL(
      (Math.sin(Date.now() / 1000) + color) % 1,
      1,
      0.5
    );
  });
  return (
    <pointLight
      ref={light}
      intensity={intensity}
      position={[10, 10 + yOffset, 10]}
      castShadow
      distance={150}
    />
  );
};

const BackgroundCycler = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  useFrame(() => {
    if (containerRef.current) {
      const { mode } = hoverState;
      const bgSpeedMap: Record<string, number> = { imagery: 100 };
      const t = Date.now() / 1000;
      let hue = 0;
      let saturation = 100;
      let lightness = 50;

      if (mode === 'music') {
        // Aphex bg — strobes on kick, snaps hue on snare, dark between hits
        const beatT3 = (t * 170) / 60;
        const sixteenth3 = (beatT3 * 4) % 1;
        const stepInBar3 = Math.floor(((beatT3 % 4) * 4) % 16);
        const kickOn3 =
          [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0][stepInBar3] || 0;
        const snareOn3 =
          [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1][stepInBar3] || 0;
        const kickFlash = kickOn3 * Math.exp(-sixteenth3 * 12);
        const snareFlash = snareOn3 * Math.exp(-sixteenth3 * 14);
        // Hue jumps on each beat — harsh complementary shifts
        const beatIdx = Math.floor(beatT3 % 8);
        const hueSteps = [0, 200, 40, 280, 160, 320, 80, 240];
        hue = hueSteps[beatIdx] ?? 0;
        lightness = 5 + kickFlash * 35 + snareFlash * 25;
        saturation = 90 + snareFlash * 10;
      } else if (mode === 'code') {
        hue = (Date.now() / 5) % 360;
        saturation = 80;
        lightness = 8;
      } else if (mode === 'words') {
        hue = (Date.now() / 5) % 360;
        lightness = 15;
      } else {
        const speed = (mode && bgSpeedMap[mode]) || 5;
        hue = (Date.now() / speed) % 360;
      }

      containerRef.current.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Expose contrasting strip/label colors as CSS custom properties
      const contrastHue = (hue + 180) % 360;
      const stripLight = lightness > 40 ? 15 : 85;
      const labelLight = stripLight > 50 ? 5 : 95;
      const root = document.documentElement;
      root.style.setProperty(
        '--strip-bg',
        `hsl(${contrastHue}, ${saturation}%, ${stripLight}%)`
      );
      root.style.setProperty(
        '--label-color',
        `hsl(${hue}, ${saturation}%, ${labelLight}%)`
      );
    }
  });
  return null;
};

const geometries = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.SphereGeometry(0.75, 16, 16),
  cone: new THREE.ConeGeometry(0.5, 1, 16),
  cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  torus: new THREE.TorusGeometry(0.5, 0.2, 12, 48),
};

// Instanced cylinder tubes for neural connections (visible at any distance)
const connectionGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 4, 1);
connectionGeo.rotateX(Math.PI / 2); // align along Z so we can lookAt

const NeuralConnections = () => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const MAX_CONNECTIONS = 250;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const midpoint = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const connMesh = ref.current;
    if (!connMesh) return;

    if (hoverState.mode !== 'code') {
      // Hide all instances by scaling to 0
      for (let c = 0; c < MAX_CONNECTIONS; c += 1) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        connMesh.setMatrixAt(c, dummy.matrix);
      }
      connMesh.instanceMatrix.needsUpdate = true;
      return;
    }

    let connCount = 0;
    const totalObjects = OBJECTS_PER_TYPE * 5;
    const thresholdSq = 20 * 20;

    for (
      let attempt = 0;
      attempt < 1000 && connCount < MAX_CONNECTIONS;
      attempt += 1
    ) {
      const a = Math.floor(Math.random() * totalObjects);
      const b = Math.floor(Math.random() * totalObjects);
      if (a !== b) {
        const ax = instancePositions[a * 3] ?? 0;
        const ay = instancePositions[a * 3 + 1] ?? 0;
        const az = instancePositions[a * 3 + 2] ?? 0;
        const bx = instancePositions[b * 3] ?? 0;
        const by = instancePositions[b * 3 + 1] ?? 0;
        const bz = instancePositions[b * 3 + 2] ?? 0;

        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < thresholdSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          // Position at midpoint
          midpoint.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
          target.set(bx, by, bz);
          dummy.position.copy(midpoint);
          dummy.lookAt(target);
          // Scale Z to match distance (cylinder is 1 unit long along Z)
          dummy.scale.set(1, 1, dist);
          dummy.updateMatrix();
          connMesh.setMatrixAt(connCount, dummy.matrix);

          // Glow color based on distance — closer = brighter
          const brightness = 1 - dist / 20;
          connMesh.setColorAt(
            connCount,
            new THREE.Color().setHSL(0.38, 1, 0.3 + brightness * 0.4)
          );
          connCount += 1;
        }
      }
    }

    // Hide remaining unused instances
    for (let c = connCount; c < MAX_CONNECTIONS; c += 1) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      connMesh.setMatrixAt(c, dummy.matrix);
    }

    connMesh.instanceMatrix.needsUpdate = true;
    if (connMesh.instanceColor) connMesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[connectionGeo, undefined, MAX_CONNECTIONS]}>
      <meshStandardMaterial
        color={0x00ff88}
        emissive={0x00ff88}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};

const Scene = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <>
      <ambientLight intensity={1.2} />
      <MovingLight speed={400} radius={25} color={0} intensity={80} />
      <MovingLight
        speed={600}
        radius={30}
        color={0.33}
        yOffset={10}
        intensity={60}
      />
      <MovingLight
        speed={300}
        radius={20}
        color={0.66}
        yOffset={-10}
        intensity={60}
      />

      <MouseTracker />
      <AutoRotateCamera />
      <BackgroundCycler containerRef={containerRef} />

      <GeometryInstances
        geometry={geometries.box}
        count={OBJECTS_PER_TYPE}
        seed={0}
      />
      <GeometryInstances
        geometry={geometries.sphere}
        count={OBJECTS_PER_TYPE}
        seed={1}
      />
      <GeometryInstances
        geometry={geometries.cone}
        count={OBJECTS_PER_TYPE}
        seed={2}
      />
      <GeometryInstances
        geometry={geometries.cylinder}
        count={OBJECTS_PER_TYPE}
        seed={3}
      />
      <GeometryInstances
        geometry={geometries.torus}
        count={OBJECTS_PER_TYPE}
        seed={4}
      />

      <NeuralConnections />
    </>
  );
};

const Evolved: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: `hsl(0, 100%, 50%)`,
        position: 'absolute',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 2, -25] }}
        flat
        gl={{ outputColorSpace: THREE.LinearSRGBColorSpace }}
      >
        <Scene containerRef={containerRef} />
      </Canvas>
    </div>
  );
};

export default Evolved;
