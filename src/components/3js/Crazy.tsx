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
    const speed = (mode && speedMap[mode]) || 12000;
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
        // NEURAL MOTHERBOARD — layered grid structure with processing nodes
        const totalIdx = seed * count + i;
        const totalObjects = OBJECTS_PER_TYPE * 5;

        // 3 horizontal layers (like PCB layers / cortical layers)
        const numLayers = 3;
        const layer = totalIdx % numLayers;
        const idxInLayer = Math.floor(totalIdx / numLayers);

        // Grid layout within each layer — objects snap to grid intersections
        const gridSize = Math.ceil(Math.sqrt(totalObjects / numLayers));
        const gridRow = Math.floor(idxInLayer / gridSize);
        const gridCol = idxInLayer % gridSize;
        const spacing = 2.8;

        // Center the grid
        const gridOffsetX = -(gridSize * spacing) / 2;
        const gridOffsetZ = -(gridSize * spacing) / 2;

        // Base grid position
        const baseX = gridCol * spacing + gridOffsetX;
        const baseY = (layer - 1) * 12; // layers spaced vertically
        const baseZ = gridRow * spacing + gridOffsetZ;

        // Some objects are "hub nodes" — larger, stay on grid
        // Others are "satellite nodes" — orbit near a hub
        const isHub = totalIdx % 5 === 0;
        const hubIdx = Math.floor(totalIdx / 5) * 5; // nearest hub
        const hubLayer = hubIdx % numLayers;
        const hubInLayer = Math.floor(hubIdx / numLayers);
        const hubRow = Math.floor(hubInLayer / gridSize);
        const hubCol = hubInLayer % gridSize;
        const hubX = hubCol * spacing + gridOffsetX;
        const hubY = (hubLayer - 1) * 12;
        const hubZ = hubRow * spacing + gridOffsetZ;

        if (isHub) {
          // Hub nodes: sit on grid, gentle pulse
          const pulse = Math.sin(t * 0.8 + offset * 0.3) * 0.3;
          dummy.position.set(
            baseX + pulse * 0.5,
            baseY + Math.sin(t * 0.3 + offset) * 0.4,
            baseZ + Math.cos(t * 0.6 + offset) * 0.3
          );
          dummy.scale.setScalar(scale * 1.1);
          dummy.rotation.x = t * 0.2;
          dummy.rotation.y = t * 0.15 + offset;
          dummy.rotation.z = Math.sin(t * 0.4 + offset) * 0.3;
        } else {
          // Satellite nodes: orbit their hub in tight formation
          const satIdx = totalIdx % 5; // 1-4
          const orbitAngle = t * (0.4 + speed * 0.5) + satIdx * (Math.PI * 2 / 4);
          const orbitRadius = 1.0 + Math.sin(t * 0.5 + offset) * 0.3;
          const orbitTilt = satIdx * 0.8 + t * 0.1;

          dummy.position.set(
            hubX + Math.cos(orbitAngle) * orbitRadius * Math.cos(orbitTilt),
            hubY + Math.sin(orbitTilt) * orbitRadius * 0.6 + Math.sin(t * 0.6 + offset) * 0.3,
            hubZ + Math.sin(orbitAngle) * orbitRadius
          );
          dummy.scale.setScalar(scale * 0.5);
          dummy.rotation.x = t * speed;
          dummy.rotation.y = orbitAngle;
          dummy.rotation.z = t * speed * 0.5;
        }

        // Data flow pulse: periodic wave that ripples across the grid
        const waveFront = (t * 3) % (gridSize * spacing * 2) - gridSize * spacing;
        const distToWave = Math.abs(dummy.position.x - waveFront);
        const waveEffect = Math.exp(-distToWave * 0.5) * 0.8;
        dummy.position.y += waveEffect * 1.5;
        // Scale bump on wave hit
        const currentScale = dummy.scale.x;
        dummy.scale.setScalar(currentScale * (1 + waveEffect * 0.4));

        // Mouse attraction
        dummy.position.x += (mouseState.x - dummy.position.x) * 0.015;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.015;
      } else if (mode === 'music') {
        // APHEX TWIN × NEURONS — organized neural lattice with breakcore pulses
        const bpm = 170;
        const beatT = (t * bpm) / 60;
        const bar = beatT % 4;
        const sixteenth = (beatT * 4) % 1;
        const stepInBar = Math.floor((bar * 4) % 16);
        const thirtySecond = (beatT * 8) % 1;

        // Drum patterns
        const kickPattern = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0];
        const snarePattern = [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1];
        const kick = (kickPattern[stepInBar] || 0) * Math.exp(-sixteenth * 12);
        const snare = (snarePattern[stepInBar] || 0) * Math.exp(-sixteenth * 14);
        const hat = Math.exp(-thirtySecond * 30) * (Math.sin(beatT * 5.37 + offset * 0.1) > 0 ? 1.5 : 0.4);
        const acidBeat = (t * bpm * 5) / (60 * 8);
        const acid = Math.exp(-((acidBeat * 2) % 1) * 8) * ([1.5, 0.5, 1.2, 0.3, 1.8][Math.floor(acidBeat * 4) % 5] || 1);

        // Neural lattice: assign each object to a cluster (neuron node)
        const totalIdx = seed * count + i;
        const numClusters = 12;
        const cluster = totalIdx % numClusters;
        const idxInCluster = Math.floor(totalIdx / numClusters);

        // Cluster centers arranged in a 3D neural network structure
        // Golden-angle spherical distribution for even spacing
        const phi = Math.acos(1 - (2 * (cluster + 0.5)) / numClusters);
        const theta = Math.PI * (1 + Math.sqrt(5)) * cluster;
        const clusterRadius = 18;
        const cx = Math.sin(phi) * Math.cos(theta) * clusterRadius;
        const cy = Math.sin(phi) * Math.sin(theta) * clusterRadius * 0.6; // flatten vertically
        const cz = Math.cos(phi) * clusterRadius;

        // Objects orbit tightly around their cluster center (dendrite structure)
        const orbitAngle = idxInCluster * 2.4 + t * (0.3 + speed); // golden angle spread
        const orbitTilt = idxInCluster * 1.1;
        const orbitRadius = 1.5 + (idxInCluster % 8) * 0.6;
        const localX = Math.cos(orbitAngle) * Math.cos(orbitTilt) * orbitRadius;
        const localY = Math.sin(orbitTilt) * orbitRadius * 0.7;
        const localZ = Math.sin(orbitAngle) * orbitRadius;

        // Per-cluster rhythmic role — each neuron cluster responds to a different element
        const clusterRole = cluster % 6;
        let reactivity = 0;
        let pulseDir = [0, 0, 0];
        if (clusterRole === 0) {
          // Kick neurons — expand outward from center
          reactivity = kick * 4;
          pulseDir = [cx * 0.15, cy * 0.15, cz * 0.15];
        } else if (clusterRole === 1) {
          // Snare neurons — lateral jolt
          reactivity = snare * 3.5;
          pulseDir = [snare * 6 * Math.sin(cluster * 2.1), 0, snare * 4 * Math.cos(cluster * 3.7)];
        } else if (clusterRole === 2) {
          // Hat neurons — rapid micro-tremor
          reactivity = hat * 2;
          pulseDir = [hat * 2 * Math.sin(t * 20 + offset), hat * 1.5 * Math.cos(t * 17 + offset), hat * 2 * Math.sin(t * 23 + offset)];
        } else if (clusterRole === 3) {
          // Acid neurons — smooth diagonal slide
          reactivity = acid * 3;
          pulseDir = [acid * 5 * Math.sin(acidBeat * Math.PI * 2), acid * 3 * Math.cos(acidBeat * Math.PI), acid * 4 * Math.cos(acidBeat * Math.PI * 2)];
        } else if (clusterRole === 4) {
          // Combined kick+snare neurons
          reactivity = (kick + snare) * 2;
          pulseDir = [(kick - snare) * 4, (kick + snare) * 3, Math.sin(beatT * 1.5) * acid * 3];
        } else {
          // Chaos neurons — everything
          const all = kick * 0.5 + snare * 0.4 + hat * 0.3 + acid * 0.4;
          reactivity = all * 2.5;
          pulseDir = [all * 3 * Math.sin(offset * 7 + t * 3), all * 2 * Math.cos(t * 2), all * 3 * Math.cos(offset * 11 + t * 2)];
        }

        // Breathing: clusters slowly expand/contract together
        const breathe = Math.sin(t * 0.4 + cluster * 0.5) * 0.15 + 1;

        // Final position: cluster center + local orbit + rhythmic pulse (all relative, no accumulation)
        dummy.position.set(
          cx * breathe + localX + pulseDir[0]! * scale,
          cy * breathe + localY + pulseDir[1]! * scale,
          cz * breathe + localZ + pulseDir[2]! * scale
        );

        // Rotation — synced to groove
        const totalGroove = kick + snare * 0.8 + hat * 0.5 + acid * 0.6;
        dummy.rotation.x = t * speed * 2 + totalGroove * 2;
        dummy.rotation.y = t * speed * 1.5 + reactivity * 3;
        dummy.rotation.z = Math.sin(t * 0.5 + offset) * 0.5 + hat * 0.8;

        // Scale — squash-and-stretch on beat hits
        const scaleBoost = 1 + reactivity * 0.4;
        const squash = 1 + kick * 0.8 + snare * 0.4;
        dummy.scale.set(
          scale * 0.7 * scaleBoost * (1 / Math.sqrt(squash)),
          scale * 0.7 * scaleBoost * squash,
          scale * 0.7 * scaleBoost * (1 / Math.sqrt(squash))
        );

        // Mouse attraction
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
        // DEFAULT — slow, relaxed drift
        dummy.position.set(...obj.position);
        dummy.rotation.x += speed * 0.04;
        dummy.rotation.y += speed * 0.05;
        dummy.rotation.z += speed * 0.02;
        dummy.position.y += Math.sin(t * 0.4 + offset) * 0.15 * scale;
        dummy.position.x += Math.cos(t * 0.3 + offset) * 0.15 * scale;
        dummy.position.z += Math.sin(t * 0.35 + offset * 1.3) * 0.1 * scale;
        dummy.scale.setScalar(scale);
        dummy.position.x += (mouseState.x - dummy.position.x) * 0.003;
        dummy.position.y += (mouseState.y - dummy.position.y) * 0.003;
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
        // Motherboard neural colors — hubs glow bright, satellites dimmer
        const totalIdx2 = seed * count + i;
        const isHub2 = totalIdx2 % 5 === 0;
        const gridSize2 = Math.ceil(Math.sqrt((OBJECTS_PER_TYPE * 5) / 3));
        const waveFront2 = (t * 3) % (gridSize2 * 2.8 * 2) - gridSize2 * 2.8;
        const wx = instancePositions[posBase] || 0;
        const distToWave2 = Math.abs(wx - waveFront2);
        const waveGlow = Math.exp(-distToWave2 * 0.5);
        if (isHub2) {
          // Hub nodes: cyan/teal, brighter, flash on wave
          const h = 0.52 + Math.sin(t * 0.3 + offset * 0.1) * 0.04;
          const lum = 0.5 + waveGlow * 0.4;
          mesh.setColorAt(i, new THREE.Color().setHSL(h, 0.6 + waveGlow * 0.3, lum));
        } else {
          // Satellites: subtler blue-green, pulse with wave
          const h = 0.56 + Math.sin(t * 0.4 + offset * 0.2) * 0.03;
          const lum = 0.35 + waveGlow * 0.35;
          mesh.setColorAt(i, new THREE.Color().setHSL(h, 0.4 + waveGlow * 0.2, lum));
        }
      } else if (mode === 'music') {
        // Neural cluster colors — each cluster has a base hue, pulses with beat
        const beatT2 = (t * 170) / 60;
        const sixteenth2 = (beatT2 * 4) % 1;
        const stepInBar2 = Math.floor(((beatT2 % 4) * 4) % 16);
        const totalIdx2 = seed * count + i;
        const cluster2 = totalIdx2 % 12;
        const clusterRole2 = cluster2 % 6;
        // Each cluster gets a distinct hue from a curated palette
        const clusterHues = [0.0, 0.55, 0.12, 0.3, 0.08, 0.75, 0.95, 0.45, 0.18, 0.65, 0.35, 0.85];
        let hue2 = clusterHues[cluster2] || 0;
        let sat2 = 0.85;
        let lum2 = 0.45;
        // Flash on beat hits per cluster role
        if (clusterRole2 === 0) {
          const kickOn = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0][stepInBar2] || 0;
          lum2 += kickOn * Math.exp(-sixteenth2 * 12) * 0.45;
        } else if (clusterRole2 === 1) {
          const snareOn = [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1][stepInBar2] || 0;
          lum2 += snareOn * Math.exp(-sixteenth2 * 14) * 0.4;
          sat2 -= snareOn * Math.exp(-sixteenth2 * 14) * 0.3;
        } else if (clusterRole2 === 2) {
          lum2 += Math.exp(-((beatT2 * 8) % 1) * 30) * 0.35;
        } else if (clusterRole2 === 3) {
          const acidB = (t * 170 * 5) / (60 * 8);
          hue2 += Math.sin(acidB * Math.PI * 2) * 0.08;
          lum2 += Math.exp(-((acidB * 2) % 1) * 8) * 0.35;
        } else {
          lum2 += Math.exp(-sixteenth2 * 12) * 0.3;
        }
        // Gentle global hue drift to keep it alive
        hue2 = (hue2 + t * 0.02) % 1;
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
        // Resting: slow, muted color drift
        const hue = (obj.hue + t * 0.005) % 1;
        mesh.setColorAt(i, new THREE.Color().setHSL(hue, 0.45, 0.4));
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
      } else if (mode === 'imagery') {
        hue = (Date.now() / 100) % 360;
        saturation = 90;
        lightness = 10;
      } else if (mode === 'words') {
        hue = (Date.now() / 5) % 360;
        lightness = 15;
      } else {
        // Resting: very slow, subtle hue drift — mostly dark, calm
        hue = (Date.now() / 200) % 360;
        saturation = 40;
        lightness = 6;
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

// --- Complex organic geometries ---

// 1. Torus knot — twisted, knotted ring
const torusKnotGeo = new THREE.TorusKnotGeometry(0.5, 0.18, 64, 12, 2, 3);

// 2. Organic blob — sphere with vertex displacement for an amoeba-like shape
const blobGeo = (() => {
  const geo = new THREE.IcosahedronGeometry(0.6, 3);
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;
    // Layered noise-like displacement
    const disp =
      1 +
      0.25 * Math.sin(nx * 4.1 + ny * 3.7) * Math.cos(nz * 5.3 + nx * 2.1) +
      0.12 * Math.sin(ny * 8.3 + nz * 6.1) * Math.cos(nx * 7.7) +
      0.06 * Math.sin(nx * 13 + ny * 11 + nz * 9);
    pos.setXYZ(i, x * disp, y * disp, z * disp);
  }
  geo.computeVertexNormals();
  return geo;
})();

// 3. Dodecahedron — 12-faced complex polyhedron
const dodecaGeo = new THREE.DodecahedronGeometry(0.6, 0);

// 4. Möbius strip — a single-sided twisted surface
const mobiusGeo = (() => {
  const geo = new THREE.BufferGeometry();
  const segments = 80;
  const width = 0.25;
  const radius = 0.5;
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j <= 1; j++) {
      const v = (j - 0.5) * width;
      const halfTwist = u / 2;
      const x = (radius + v * Math.cos(halfTwist)) * Math.cos(u);
      const y = (radius + v * Math.cos(halfTwist)) * Math.sin(u);
      const z = v * Math.sin(halfTwist);
      vertices.push(x, y, z);
    }
    if (i < segments) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
})();

// 5. Twisted torus knot variant — wilder topology
const twistedKnotGeo = new THREE.TorusKnotGeometry(0.45, 0.14, 64, 10, 3, 5);

const geometries = {
  torusKnot: torusKnotGeo,
  blob: blobGeo,
  dodecahedron: dodecaGeo,
  mobius: mobiusGeo,
  twistedKnot: twistedKnotGeo,
};

// Instanced cylinder for neural axon curves
const connectionGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 5, 1);
connectionGeo.rotateX(Math.PI / 2);

// Tapered dendrite geometry — thick base, thin tip (for primary + branching)
const dendriteGeo = new THREE.CylinderGeometry(0.015, 0.06, 1, 4, 1);
dendriteGeo.rotateX(Math.PI / 2);
dendriteGeo.translate(0, 0, 0.5);

type Connection = {
  from: number;
  to: number;
  life: number;
  maxLife: number;
  age: number;
  chain: number;
  indexInChain: number;
  chainLength: number;
  impulseSpeed: number;
  impulsePhase: number;
  // Two control point offsets for cubic bezier S-curves
  ctrl1Dx: number; ctrl1Dy: number; ctrl1Dz: number;
  ctrl2Dx: number; ctrl2Dy: number; ctrl2Dz: number;
  // Per-connection wave params for breathing
  breathPhase: number;
  breathSpeed: number;
};

type Dendrite = {
  objectIdx: number;
  // Primary branch direction + params
  dirX: number; dirY: number; dirZ: number;
  length: number;
  phase: number;
  waveSpeed: number;
  life: number;
  maxLife: number;
  age: number;
  // Fork: secondary branch splits off at forkT along primary
  hasFork: boolean;
  forkDirX: number; forkDirY: number; forkDirZ: number;
  forkLength: number;
  forkPhase: number;
};

const CURVE_SUBDIVS = 6;
const MAX_LOGICAL = 150;
const MAX_CURVE_INSTANCES = MAX_LOGICAL * CURVE_SUBDIVS; // 900
const MAX_DENDRITES = 600; // primary + fork segments share this pool

// Cubic bezier: (1-t)³A + 3(1-t)²tC1 + 3(1-t)t²C2 + t³B
const cubicBezier = (
  ax: number, ay: number, az: number,
  c1x: number, c1y: number, c1z: number,
  c2x: number, c2y: number, c2z: number,
  bx: number, by: number, bz: number,
  t: number,
  out: THREE.Vector3
) => {
  const u = 1 - t;
  const u2 = u * u;
  const u3 = u2 * u;
  const t2 = t * t;
  const t3 = t2 * t;
  out.set(
    u3 * ax + 3 * u2 * t * c1x + 3 * u * t2 * c2x + t3 * bx,
    u3 * ay + 3 * u2 * t * c1y + 3 * u * t2 * c2y + t3 * by,
    u3 * az + 3 * u2 * t * c1z + 3 * u * t2 * c2z + t3 * bz
  );
};

// Compute perpendicular offset in a random direction
const perpOffset = (
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  magnitude: number
): [number, number, number] => {
  let dx = bx - ax; let dy = by - ay; let dz = bz - az;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
  dx /= len; dy /= len; dz /= len;
  let upX = 0; let upY = 1; let upZ = 0;
  if (Math.abs(dy) > 0.9) { upX = 1; upY = 0; upZ = 0; }
  const px = dy * upZ - dz * upY;
  const py = dz * upX - dx * upZ;
  const pz = dx * upY - dy * upX;
  const pLen = Math.sqrt(px * px + py * py + pz * pz) + 0.001;
  const qx = dy * pz / pLen - dz * py / pLen;
  const qy = dz * px / pLen - dx * pz / pLen;
  const qz = dx * py / pLen - dy * px / pLen;
  const angle = Math.random() * Math.PI * 2;
  const cosA = Math.cos(angle); const sinA = Math.sin(angle);
  return [
    (px / pLen * cosA + qx * sinA) * magnitude,
    (py / pLen * cosA + qy * sinA) * magnitude,
    (pz / pLen * cosA + qz * sinA) * magnitude,
  ];
};

const buildChains = (totalObjects: number): Connection[] => {
  const connections: Connection[] = [];
  const used = new Set<number>();
  let chainId = 0;

  for (let attempt = 0; attempt < 80 && connections.length < MAX_LOGICAL; attempt += 1) {
    const start = Math.floor(Math.random() * totalObjects);
    if (used.has(start)) continue;

    const chainLen = 3 + Math.floor(Math.random() * 6);
    let current = start;
    used.add(current);
    const chainConns: Connection[] = [];
    const impulseSpeed = 1.2 + Math.random() * 2.5;
    const impulsePhase = Math.random() * Math.PI * 2;

    for (let step = 0; step < chainLen && connections.length + chainConns.length < MAX_LOGICAL; step += 1) {
      const cx = instancePositions[current * 3] ?? 0;
      const cy = instancePositions[current * 3 + 1] ?? 0;
      const cz = instancePositions[current * 3 + 2] ?? 0;

      let bestDist = Infinity;
      let bestIdx = -1;
      for (let s = 0; s < 50; s += 1) {
        const candidate = Math.floor(Math.random() * totalObjects);
        if (candidate === current || used.has(candidate)) continue;
        const ddx = (instancePositions[candidate * 3] ?? 0) - cx;
        const ddy = (instancePositions[candidate * 3 + 1] ?? 0) - cy;
        const ddz = (instancePositions[candidate * 3 + 2] ?? 0) - cz;
        const distSq = ddx * ddx + ddy * ddy + ddz * ddz;
        if (distSq < bestDist && distSq > 1) { bestDist = distSq; bestIdx = candidate; }
      }

      if (bestIdx === -1 || bestDist > 22 * 22) break;
      used.add(bestIdx);

      const dist = Math.sqrt(bestDist);
      const bxP = instancePositions[bestIdx * 3] ?? 0;
      const byP = instancePositions[bestIdx * 3 + 1] ?? 0;
      const bzP = instancePositions[bestIdx * 3 + 2] ?? 0;

      // Two independent offsets for S-curve — opposite-ish directions
      const mag1 = dist * (0.25 + Math.random() * 0.4);
      const mag2 = dist * (0.2 + Math.random() * 0.35);
      const [c1x, c1y, c1z] = perpOffset(cx, cy, cz, bxP, byP, bzP, mag1);
      const [c2x, c2y, c2z] = perpOffset(cx, cy, cz, bxP, byP, bzP, mag2);

      chainConns.push({
        from: current,
        to: bestIdx,
        life: 0,
        maxLife: 2 + Math.random() * 3,
        age: -step * 0.12,
        chain: chainId,
        indexInChain: step,
        chainLength: chainLen,
        impulseSpeed,
        impulsePhase,
        ctrl1Dx: c1x, ctrl1Dy: c1y, ctrl1Dz: c1z,
        ctrl2Dx: -c2x * 0.6, ctrl2Dy: -c2y * 0.6, ctrl2Dz: -c2z * 0.6, // opposite for S-shape
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.4 + Math.random() * 0.8,
      });
      current = bestIdx;
    }

    if (chainConns.length >= 2) {
      for (const cc of chainConns) cc.chainLength = chainConns.length;
      connections.push(...chainConns);
      chainId += 1;
    }
  }

  return connections;
};

// Build branching dendrites at neural nodes
const buildDendrites = (
  connections: Connection[],
  totalObjects: number
): Dendrite[] => {
  const dendrites: Dendrite[] = [];
  const nodeSet = new Set<number>();

  for (const c of connections) { nodeSet.add(c.from); nodeSet.add(c.to); }
  for (let i = 0; i < 50; i += 1) nodeSet.add(Math.floor(Math.random() * totalObjects));

  const nodes = Array.from(nodeSet);
  for (const idx of nodes) {
    if (dendrites.length >= MAX_DENDRITES) break;
    const numDen = 2 + Math.floor(Math.random() * 4); // 2-5 per node
    for (let d = 0; d < numDen && dendrites.length < MAX_DENDRITES; d += 1) {
      const px = instancePositions[idx * 3] ?? 0;
      const py = instancePositions[idx * 3 + 1] ?? 0;
      const pz = instancePositions[idx * 3 + 2] ?? 0;
      const pLen = Math.sqrt(px * px + py * py + pz * pz) + 0.01;

      let rx = (Math.random() - 0.5);
      let ry = (Math.random() - 0.5);
      let rz = (Math.random() - 0.5);
      rx += px / pLen * 0.15;
      ry += py / pLen * 0.15;
      rz += pz / pLen * 0.15;
      const rLen = Math.sqrt(rx * rx + ry * ry + rz * rz) + 0.001;

      // Fork: 60% chance to branch
      const hasFork = Math.random() < 0.6;
      // Fork direction: deviate from primary by 30-70 degrees
      let fx = rx / rLen + (Math.random() - 0.5) * 1.2;
      let fy = ry / rLen + (Math.random() - 0.5) * 1.2;
      let fz = rz / rLen + (Math.random() - 0.5) * 1.2;
      const fLen = Math.sqrt(fx * fx + fy * fy + fz * fz) + 0.001;

      dendrites.push({
        objectIdx: idx,
        dirX: rx / rLen, dirY: ry / rLen, dirZ: rz / rLen,
        length: 1 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        waveSpeed: 0.5 + Math.random() * 1.5,
        life: 0,
        maxLife: 2.5 + Math.random() * 3,
        age: -(Math.random() * 0.6),
        hasFork,
        forkDirX: fx / fLen, forkDirY: fy / fLen, forkDirZ: fz / fLen,
        forkLength: 0.5 + Math.random() * 1.5,
        forkPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  return dendrites;
};

// Reusable vectors
const _p0 = new THREE.Vector3();
const _p1 = new THREE.Vector3();
const _tgt = new THREE.Vector3();

const NeuralConnections = () => {
  const curveRef = useRef<THREE.InstancedMesh>(null);
  const dendriteRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const state = useRef<{
    connections: Connection[];
    dendrites: Dendrite[];
    rebuildTimer: number;
    wasActive: boolean;
  }>({
    connections: [],
    dendrites: [],
    rebuildTimer: 0,
    wasActive: false,
  });

  useFrame((_, delta) => {
    const curveMesh = curveRef.current;
    const dendriteMesh = dendriteRef.current;
    if (!curveMesh || !dendriteMesh) return;

    const mode = hoverState.mode;
    const isActive = mode === 'code' || mode === 'imagery' || mode === 'music';

    // --- Hide when inactive ---
    if (!isActive) {
      if (state.current.wasActive) {
        let anyVisible = false;
        for (const conn of state.current.connections) {
          if (conn.life > 0) { conn.life = Math.max(0, conn.life - delta * 3); anyVisible = true; }
        }
        for (const den of state.current.dendrites) {
          if (den.life > 0) { den.life = Math.max(0, den.life - delta * 3); anyVisible = true; }
        }
        if (!anyVisible) {
          state.current.wasActive = false;
          state.current.connections = [];
          state.current.dendrites = [];
        }
      }
      if (!state.current.wasActive) {
        for (let i = 0; i < MAX_CURVE_INSTANCES; i += 1) {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          curveMesh.setMatrixAt(i, dummy.matrix);
        }
        for (let i = 0; i < MAX_DENDRITES; i += 1) {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          dendriteMesh.setMatrixAt(i, dummy.matrix);
        }
        curveMesh.instanceMatrix.needsUpdate = true;
        dendriteMesh.instanceMatrix.needsUpdate = true;
        return;
      }
    } else {
      state.current.wasActive = true;
    }

    const totalObjects = OBJECTS_PER_TYPE * 5;
    const t = Date.now() / 1000;
    const isCode = mode === 'code';

    // --- Rebuild chains periodically ---
    state.current.rebuildTimer -= delta;
    if (state.current.connections.length === 0 || state.current.rebuildTimer <= 0) {
      const alive = state.current.connections.filter(c => c.age < c.maxLife * 0.7);
      const fresh = buildChains(totalObjects);
      const merged = [...alive];
      for (let f = 0; f < fresh.length && merged.length < MAX_LOGICAL; f += 1) {
        merged.push(fresh[f]!);
      }
      state.current.connections = merged.slice(0, MAX_LOGICAL);
      state.current.dendrites = buildDendrites(state.current.connections, totalObjects);
      state.current.rebuildTimer = 1.2 + Math.random() * 1.5;
    }

    // --- Render curved axon connections (cubic bezier S-curves) ---
    const conns = state.current.connections;
    let instanceIdx = 0;

    for (let c = 0; c < conns.length; c += 1) {
      const conn = conns[c]!;
      conn.age += delta;

      if (conn.age < 0) {
        for (let s = 0; s < CURVE_SUBDIVS; s += 1) {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          curveMesh.setMatrixAt(instanceIdx + s, dummy.matrix);
        }
        instanceIdx += CURVE_SUBDIVS;
        continue;
      }

      const lifeRatio = conn.age / conn.maxLife;
      const impulsePos = ((t * conn.impulseSpeed + conn.impulsePhase) % (conn.chainLength * CURVE_SUBDIVS + 4)) - 1;

      let baseLife: number;
      if (lifeRatio < 0.12) {
        baseLife = lifeRatio / 0.12;
      } else if (lifeRatio < 0.8) {
        baseLife = 1;
      } else if (lifeRatio < 1) {
        baseLife = 1 - (lifeRatio - 0.8) / 0.2;
      } else {
        baseLife = 0;
      }
      conn.life = baseLife;

      const ax = instancePositions[conn.from * 3] ?? 0;
      const ay = instancePositions[conn.from * 3 + 1] ?? 0;
      const az = instancePositions[conn.from * 3 + 2] ?? 0;
      const bx = instancePositions[conn.to * 3] ?? 0;
      const by = instancePositions[conn.to * 3 + 1] ?? 0;
      const bz = instancePositions[conn.to * 3 + 2] ?? 0;

      // Breathing: control points undulate over time
      const breathe = Math.sin(t * conn.breathSpeed + conn.breathPhase);
      const breathe2 = Math.cos(t * conn.breathSpeed * 0.7 + conn.breathPhase * 1.3);
      const bAmt = 1 + breathe * 0.35;
      const bAmt2 = 1 + breathe2 * 0.3;

      // Control point 1: at 1/3 along line + offset
      const c1x = ax + (bx - ax) * 0.33 + conn.ctrl1Dx * bAmt;
      const c1y = ay + (by - ay) * 0.33 + conn.ctrl1Dy * bAmt;
      const c1z = az + (bz - az) * 0.33 + conn.ctrl1Dz * bAmt;
      // Control point 2: at 2/3 along line + offset (opposite direction = S-shape)
      const c2x = ax + (bx - ax) * 0.66 + conn.ctrl2Dx * bAmt2;
      const c2y = ay + (by - ay) * 0.66 + conn.ctrl2Dy * bAmt2;
      const c2z = az + (bz - az) * 0.66 + conn.ctrl2Dz * bAmt2;

      for (let s = 0; s < CURVE_SUBDIVS; s += 1) {
        const t0 = s / CURVE_SUBDIVS;
        const t1 = (s + 1) / CURVE_SUBDIVS;

        cubicBezier(ax, ay, az, c1x, c1y, c1z, c2x, c2y, c2z, bx, by, bz, t0, _p0);
        cubicBezier(ax, ay, az, c1x, c1y, c1z, c2x, c2y, c2z, bx, by, bz, t1, _p1);

        const globalSubIdx = conn.indexInChain * CURVE_SUBDIVS + s;
        const distFromImpulse = Math.abs(globalSubIdx - impulsePos);
        const impulse = Math.max(0, 1 - distFromImpulse * 0.3);

        const segLife = baseLife * (0.15 + impulse * 0.85);

        if (segLife < 0.01) {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          curveMesh.setMatrixAt(instanceIdx, dummy.matrix);
          instanceIdx += 1;
          continue;
        }

        const sdx = _p1.x - _p0.x;
        const sdy = _p1.y - _p0.y;
        const sdz = _p1.z - _p0.z;
        const segLen = Math.sqrt(sdx * sdx + sdy * sdy + sdz * sdz);

        if (segLen < 0.01) {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          curveMesh.setMatrixAt(instanceIdx, dummy.matrix);
          instanceIdx += 1;
          continue;
        }

        dummy.position.set((_p0.x + _p1.x) / 2, (_p0.y + _p1.y) / 2, (_p0.z + _p1.z) / 2);
        _tgt.copy(_p1);
        dummy.lookAt(_tgt);

        // Organic taper: thick in middle, thin at ends, with micro-variation
        const tMid = (t0 + t1) / 2;
        const taper = 0.4 + Math.sin(tMid * Math.PI) * 0.8;
        const micro = 0.9 + Math.sin(t * 4 + globalSubIdx * 1.7 + conn.breathPhase) * 0.1;
        const thk = taper * (0.35 + impulse * 1.5) * segLife * micro;
        dummy.scale.set(thk, thk, segLen);
        dummy.updateMatrix();
        curveMesh.setMatrixAt(instanceIdx, dummy.matrix);

        // Color with impulse glow
        if (isCode) {
          const hue = 0.55 + (conn.chain % 12) * 0.007 + impulse * 0.02;
          const sat = 0.25 + impulse * 0.4;
          const lightness = 0.3 + segLife * 0.55;
          curveMesh.setColorAt(instanceIdx, new THREE.Color().setHSL(hue, sat, lightness));
        } else if (mode === 'music') {
          // Music synapses — hot colors that flash with beat impulses
          const beatT3 = (t * 170) / 60;
          const kick3 = ([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0][Math.floor(((beatT3 % 4) * 4) % 16)] || 0) * Math.exp(-((beatT3 * 4) % 1) * 12);
          const clusterHues = [0.0, 0.55, 0.12, 0.3, 0.08, 0.75, 0.95, 0.45, 0.18, 0.65, 0.35, 0.85];
          const hue = (clusterHues[conn.chain % 12] || 0) + t * 0.02 + impulse * 0.05;
          const sat = 0.6 + impulse * 0.4;
          const lightness = 0.2 + segLife * 0.4 + kick3 * 0.3 + impulse * 0.2;
          curveMesh.setColorAt(instanceIdx, new THREE.Color().setHSL(hue % 1, sat, lightness));
        } else {
          const hue = 0.77 + (conn.chain % 12) * 0.012 + impulse * 0.06;
          const sat = 0.3 + impulse * 0.5;
          const lightness = 0.25 + segLife * 0.6;
          curveMesh.setColorAt(instanceIdx, new THREE.Color().setHSL(hue, sat, lightness));
        }

        instanceIdx += 1;
      }
    }

    for (let i = instanceIdx; i < MAX_CURVE_INSTANCES; i += 1) {
      dummy.scale.setScalar(0); dummy.updateMatrix();
      curveMesh.setMatrixAt(i, dummy.matrix);
    }
    curveMesh.instanceMatrix.needsUpdate = true;
    if (curveMesh.instanceColor) curveMesh.instanceColor.needsUpdate = true;

    // --- Render branching dendrites ---
    const dens = state.current.dendrites;
    let dIdx = 0;

    for (let d = 0; d < dens.length && dIdx < MAX_DENDRITES; d += 1) {
      const den = dens[d]!;
      den.age += delta;

      if (den.age < 0) {
        // Primary hidden
        dummy.scale.setScalar(0); dummy.updateMatrix();
        dendriteMesh.setMatrixAt(dIdx, dummy.matrix);
        dIdx += 1;
        // Fork hidden
        if (den.hasFork && dIdx < MAX_DENDRITES) {
          dendriteMesh.setMatrixAt(dIdx, dummy.matrix);
          dIdx += 1;
        }
        continue;
      }

      const lifeRatio = den.age / den.maxLife;
      if (lifeRatio < 0.2) {
        den.life = lifeRatio / 0.2;
      } else if (lifeRatio < 0.7) {
        den.life = 0.6 + Math.sin(t * den.waveSpeed + den.phase) * 0.4;
      } else if (lifeRatio < 1) {
        den.life = (1 - (lifeRatio - 0.7) / 0.3) * (0.6 + Math.sin(t * den.waveSpeed + den.phase) * 0.4);
      } else {
        den.life = 0;
      }

      // Base position
      const px = instancePositions[den.objectIdx * 3] ?? 0;
      const py = instancePositions[den.objectIdx * 3 + 1] ?? 0;
      const pz = instancePositions[den.objectIdx * 3 + 2] ?? 0;

      // Organic waving: layered sine waves for natural sway
      const w1 = Math.sin(t * den.waveSpeed + den.phase) * 0.35;
      const w2 = Math.cos(t * den.waveSpeed * 0.6 + den.phase * 1.7) * 0.25;
      const w3 = Math.sin(t * den.waveSpeed * 1.3 + den.phase * 0.5) * 0.15;

      // Primary dendrite tip
      const tipX = px + (den.dirX + w1 * den.dirY + w3 * den.dirZ) * den.length;
      const tipY = py + (den.dirY + w2 * den.dirZ + w1 * den.dirX) * den.length;
      const tipZ = pz + (den.dirZ + w3 * den.dirX + w2 * den.dirY) * den.length;

      if (den.life > 0.01) {
        dummy.position.set(px, py, pz);
        _tgt.set(tipX, tipY, tipZ);
        dummy.lookAt(_tgt);
        const dLen = Math.sqrt(
          (tipX - px) * (tipX - px) + (tipY - py) * (tipY - py) + (tipZ - pz) * (tipZ - pz)
        );
        // Grow effect: length scales with life during fade-in
        const growLen = dLen * Math.min(1, den.life * 1.5);
        const thk = den.life * 0.7;
        dummy.scale.set(thk, thk, growLen);
        dummy.updateMatrix();
        dendriteMesh.setMatrixAt(dIdx, dummy.matrix);

        if (isCode) {
          const hue = 0.57 + Math.sin(den.phase) * 0.04;
          dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(hue, 0.3, 0.3 + den.life * 0.35));
        } else if (mode === 'music') {
          const hue = (0.0 + Math.sin(den.phase) * 0.15 + t * 0.02) % 1;
          dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(hue, 0.7, 0.25 + den.life * 0.4));
        } else {
          const hue = 0.79 + Math.sin(den.phase) * 0.05;
          dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(hue, 0.3, 0.25 + den.life * 0.4));
        }
      } else {
        dummy.scale.setScalar(0); dummy.updateMatrix();
        dendriteMesh.setMatrixAt(dIdx, dummy.matrix);
      }
      dIdx += 1;

      // Secondary fork branch — splits off from midpoint of primary
      if (den.hasFork && dIdx < MAX_DENDRITES) {
        if (den.life > 0.05) {
          // Fork base = midpoint of primary dendrite
          const fBaseX = (px + tipX) / 2;
          const fBaseY = (py + tipY) / 2;
          const fBaseZ = (pz + tipZ) / 2;

          const fw1 = Math.sin(t * den.waveSpeed * 0.8 + den.forkPhase) * 0.4;
          const fw2 = Math.cos(t * den.waveSpeed * 1.1 + den.forkPhase * 0.7) * 0.3;
          const fTipX = fBaseX + (den.forkDirX + fw1 * den.forkDirY) * den.forkLength;
          const fTipY = fBaseY + (den.forkDirY + fw2 * den.forkDirZ) * den.forkLength;
          const fTipZ = fBaseZ + (den.forkDirZ + fw1 * den.forkDirX) * den.forkLength;

          dummy.position.set(fBaseX, fBaseY, fBaseZ);
          _tgt.set(fTipX, fTipY, fTipZ);
          dummy.lookAt(_tgt);
          const fLen = Math.sqrt(
            (fTipX - fBaseX) ** 2 + (fTipY - fBaseY) ** 2 + (fTipZ - fBaseZ) ** 2
          );
          const fGrow = fLen * Math.min(1, den.life * 1.2);
          const fThk = den.life * 0.45; // thinner than primary
          dummy.scale.set(fThk, fThk, fGrow);
          dummy.updateMatrix();
          dendriteMesh.setMatrixAt(dIdx, dummy.matrix);

          if (isCode) {
            dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(0.58, 0.25, 0.28 + den.life * 0.3));
          } else if (mode === 'music') {
            const fHue = (0.05 + Math.sin(den.forkPhase) * 0.12 + t * 0.02) % 1;
            dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(fHue, 0.6, 0.2 + den.life * 0.35));
          } else {
            dendriteMesh.setColorAt(dIdx, new THREE.Color().setHSL(0.81, 0.25, 0.22 + den.life * 0.35));
          }
        } else {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          dendriteMesh.setMatrixAt(dIdx, dummy.matrix);
        }
        dIdx += 1;
      }
    }

    // Hide remaining dendrite slots
    for (let i = dIdx; i < MAX_DENDRITES; i += 1) {
      dummy.scale.setScalar(0); dummy.updateMatrix();
      dendriteMesh.setMatrixAt(i, dummy.matrix);
    }
    dendriteMesh.instanceMatrix.needsUpdate = true;
    if (dendriteMesh.instanceColor) dendriteMesh.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={curveRef} args={[connectionGeo, undefined, MAX_CURVE_INSTANCES]}>
        <meshStandardMaterial
          color={0xaaccff}
          emissive={0xaaccff}
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </instancedMesh>
      <instancedMesh ref={dendriteRef} args={[dendriteGeo, undefined, MAX_DENDRITES]}>
        <meshStandardMaterial
          color={0x99bbdd}
          emissive={0x99bbdd}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </instancedMesh>
    </>
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
        geometry={geometries.torusKnot}
        count={OBJECTS_PER_TYPE}
        seed={0}
      />
      <GeometryInstances
        geometry={geometries.blob}
        count={OBJECTS_PER_TYPE}
        seed={1}
      />
      <GeometryInstances
        geometry={geometries.dodecahedron}
        count={OBJECTS_PER_TYPE}
        seed={2}
      />
      <GeometryInstances
        geometry={geometries.mobius}
        count={OBJECTS_PER_TYPE}
        seed={3}
      />
      <GeometryInstances
        geometry={geometries.twistedKnot}
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
