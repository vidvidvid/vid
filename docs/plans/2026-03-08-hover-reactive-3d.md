# Hover-Reactive 3D Backgrounds Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the 3D background animation react uniquely to each menu item hover — calm default, neural connections for Code, rhythmic pulsing for Music, total madness for Imagery, gravitational collapse for Words.

**Architecture:** Module-level `hoverState` object shared between index.tsx and Crazy.tsx (same pattern as existing `mouseState`). Each `useFrame` loop branches on `hoverState.mode` to apply mode-specific behavior. A new `NeuralConnections` component draws `LineSegments` for Code mode using a shared `Float32Array` of instance positions.

**Tech Stack:** React, Three.js, @react-three/fiber (all already in use)

---

### Task 1: Add hoverState export and wire up index.tsx

**Files:**
- Modify: `src/components/3js/Crazy.tsx:9` (after OBJECTS_PER_TYPE)
- Modify: `src/pages/index.tsx` (add hover handlers)
- Modify: `src/components/EpilepsyTrigger.tsx` (add onMouseEnter/Leave prop)

**Step 1: Add hoverState and instancePositions to Crazy.tsx**

After line 9 (`const OBJECTS_PER_TYPE = 100;`), add:

```ts
// Shared hover state — set by index.tsx, read by useFrame loops
export const hoverState = { mode: null as string | null };

// Shared position buffer for neural connections
const instancePositions = new Float32Array(OBJECTS_PER_TYPE * 5 * 3);
```

**Step 2: Add hover handlers in index.tsx**

Import hoverState:
```ts
import Crazy, { hoverState } from '@/components/3js/Crazy';
```

Wrap each menu item's `<Box position="relative">` with onMouseEnter/onMouseLeave. The outer Box (the one with `position="relative"`) gets the handlers:

Code box:
```tsx
<Box
  position="relative"
  onMouseEnter={() => { hoverState.mode = 'code'; }}
  onMouseLeave={() => { hoverState.mode = null; }}
>
```

Music box:
```tsx
<Box
  position="relative"
  onMouseEnter={() => { hoverState.mode = 'music'; }}
  onMouseLeave={() => { hoverState.mode = null; }}
>
```

Imagery box:
```tsx
<Box
  position="relative"
  onMouseEnter={() => { hoverState.mode = 'imagery'; }}
  onMouseLeave={() => { hoverState.mode = null; }}
>
```

Words box:
```tsx
<Box
  position="relative"
  onMouseEnter={() => { hoverState.mode = 'words'; }}
  onMouseLeave={() => { hoverState.mode = null; }}
>
```

**Step 3: Add hover props to EpilepsyTrigger**

Add optional `onMouseEnter`/`onMouseLeave` props to EpilepsyTrigger and pass them to the outer Box:

```tsx
type EpilepsyTriggerProps = {
  title: string;
  location: string;
  hoverEffect: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};
```

Add to the outer Box: `onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}`

Note: Actually the hover handlers go on the parent `<Box position="relative">` in index.tsx, not on EpilepsyTrigger itself — so this step may not be needed. The parent Box already wraps it.

**Step 4: Verify dev server**

Run: `npm run dev`
Expected: Site loads, no errors. Hover state changes don't visibly affect anything yet.

**Step 5: Commit**

```bash
git add src/components/3js/Crazy.tsx src/pages/index.tsx
git commit -m "feat: add hoverState mechanism for reactive 3D backgrounds"
```

---

### Task 2: Calm default mode

**Files:**
- Modify: `src/components/3js/Crazy.tsx` — GeometryInstances useFrame (lines 94-142), AutoRotateCamera (lines 52-64), BackgroundCycler (lines 188-200)

**Step 1: Add hue to objectData**

In the `objectData` useMemo (line 80-92), change `color: getRandomColor()` to `hue: Math.random()`:

```ts
const objectData = useMemo(
  () =>
    Array.from({ length: count }, (_, i) => ({
      position: getRandomPosition(),
      scale: getRandomScale(),
      hue: Math.random(),
      speed: getRandomSpeed(),
      crazy: false,
      crazyStart: 0,
      offset: seed * 1000 + i,
    })),
  [count, seed]
);
```

**Step 2: Replace the entire useFrame in GeometryInstances**

Replace the useFrame block (lines 94-142) with the calm default behavior. Other modes will be added in subsequent tasks:

```ts
useFrame(() => {
  if (!ref.current) return;
  const mode = hoverState.mode;
  const t = Date.now() / 1000;

  objectData.forEach((obj, i) => {
    const { scale, speed, offset } = obj;
    const posBase = (seed * count + i) * 3;

    // DEFAULT — calm floating
    dummy.position.set(...obj.position);
    dummy.rotation.x += speed * 0.3;
    dummy.rotation.y += speed * 0.3;
    dummy.rotation.z += speed * 0.15;
    dummy.position.y += Math.sin(t + offset) * 0.3 * scale;
    dummy.position.x += Math.cos(t + offset) * 0.3 * scale;
    dummy.scale.setScalar(scale);

    // Gentle mouse attraction
    dummy.position.x += (mouseState.x - dummy.position.x) * 0.005;
    dummy.position.y += (mouseState.y - dummy.position.y) * 0.005;

    // Store position for neural connections
    instancePositions[posBase] = dummy.position.x;
    instancePositions[posBase + 1] = dummy.position.y;
    instancePositions[posBase + 2] = dummy.position.z;

    dummy.updateMatrix();
    ref.current.setMatrixAt(i, dummy.matrix);

    // Calm color: slowly cycling hue
    const hue = (obj.hue + t * 0.02) % 1;
    ref.current.setColorAt(i, new THREE.Color().setHSL(hue, 0.7, 0.5));
  });

  ref.current.instanceMatrix.needsUpdate = true;
  if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
});
```

**Step 3: Slow down AutoRotateCamera**

Change the camera speed from `/3000` to `/6000`:

```ts
const AutoRotateCamera = () => {
  const { camera } = useThree();

  useFrame(() => {
    const mode = hoverState.mode;
    const speed = mode === 'imagery' ? 1500 : mode === 'music' ? 3000 : mode === 'code' ? 4000 : 6000;
    const t = Date.now() / speed;
    camera.position.x = 25 * Math.sin(t);
    camera.position.z = 25 * Math.cos(t);
    camera.position.y = 10 * Math.sin(t * 0.7);
    camera.lookAt(0, 0, 0);
  });

  return null;
};
```

**Step 4: Slow down BackgroundCycler**

Change the color cycling speed based on mode:

```ts
const BackgroundCycler = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  useFrame(() => {
    if (containerRef.current) {
      const mode = hoverState.mode;
      const speed = mode === 'imagery' ? 100 : mode === 'music' ? 30 : 5;
      const hue = (Date.now() / speed) % 360;
      containerRef.current.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    }
  });
  return null;
};
```

**Step 5: Verify**

Run: `npm run dev`
Expected: Background is much calmer — slow floating, slow rotation, gentle colors. Background color cycles slowly.

**Step 6: Commit**

```bash
git add src/components/3js/Crazy.tsx
git commit -m "feat: calm default mode for 3D background"
```

---

### Task 3: Code hover — Neural Network connections

**Files:**
- Modify: `src/components/3js/Crazy.tsx` — add code branch to useFrame, add NeuralConnections component, add to Scene

**Step 1: Add code mode branch to GeometryInstances useFrame**

In the useFrame, before the default behavior block, add an `if (mode === 'code')` branch:

```ts
if (mode === 'code') {
  // Neural network mode — objects cluster, green/cyan palette
  dummy.position.set(...obj.position);
  dummy.position.y += Math.sin(t * 0.5 + offset) * 0.3 * scale;
  dummy.position.x += Math.cos(t * 0.5 + offset) * 0.3 * scale;
  dummy.rotation.x += speed * 0.5;
  dummy.rotation.y += speed * 0.5;
  dummy.scale.setScalar(scale * 0.8);

  // Stronger mouse attraction — clustering
  dummy.position.x += (mouseState.x - dummy.position.x) * 0.02;
  dummy.position.y += (mouseState.y - dummy.position.y) * 0.02;
} else {
  // DEFAULT — calm floating (existing code from Task 2)
  ...
}
```

And for the color section, add code mode:
```ts
if (mode === 'code') {
  const h = 0.3 + Math.sin(t * 0.5 + offset * 0.1) * 0.1;
  ref.current.setColorAt(i, new THREE.Color().setHSL(h, 0.8, 0.5));
} else {
  // calm default
  const hue = (obj.hue + t * 0.02) % 1;
  ref.current.setColorAt(i, new THREE.Color().setHSL(hue, 0.7, 0.5));
}
```

**Step 2: Add NeuralConnections component**

Add this component before the `Scene` component:

```tsx
const NeuralConnections = () => {
  const lineRef = useRef<THREE.LineSegments>();
  const MAX_LINES = 200;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_LINES * 2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(() => {
    if (!lineRef.current) return;
    if (hoverState.mode !== 'code') {
      geometry.setDrawRange(0, 0);
      return;
    }

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    let lineCount = 0;
    const totalObjects = OBJECTS_PER_TYPE * 5;
    const threshold = 15;
    const thresholdSq = threshold * threshold;

    for (let attempt = 0; attempt < 600 && lineCount < MAX_LINES; attempt++) {
      const a = Math.floor(Math.random() * totalObjects);
      const b = Math.floor(Math.random() * totalObjects);
      if (a === b) continue;

      const ax = instancePositions[a * 3];
      const ay = instancePositions[a * 3 + 1];
      const az = instancePositions[a * 3 + 2];
      const bx = instancePositions[b * 3];
      const by = instancePositions[b * 3 + 1];
      const bz = instancePositions[b * 3 + 2];

      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < thresholdSq) {
        const idx = lineCount * 6;
        arr[idx] = ax;
        arr[idx + 1] = ay;
        arr[idx + 2] = az;
        arr[idx + 3] = bx;
        arr[idx + 4] = by;
        arr[idx + 5] = bz;
        lineCount++;
      }
    }

    posAttr.needsUpdate = true;
    geometry.setDrawRange(0, lineCount * 2);
  });

  return <lineSegments ref={lineRef} geometry={geometry} material={material} />;
};
```

**Step 3: Add NeuralConnections to Scene**

In the Scene component, add `<NeuralConnections />` after the `<VidGraffiti />` line.

**Step 4: Verify**

Run: `npm run dev`
Expected: Hovering "Code" shows green glowing connection lines between nearby objects, objects shift to green/cyan palette.

**Step 5: Commit**

```bash
git add src/components/3js/Crazy.tsx
git commit -m "feat: neural network connections on Code hover"
```

---

### Task 4: Music hover — Rhythmic pulsing

**Files:**
- Modify: `src/components/3js/Crazy.tsx` — add music branch to useFrame

**Step 1: Add music mode branch**

Add `else if (mode === 'music')` branch in the GeometryInstances useFrame, before the default:

```ts
} else if (mode === 'music') {
  // Rhythmic mode — 130 BPM exponential decay pulse
  const bpm = 130;
  const beatPhase = ((t * bpm) / 60) % 1;
  const pulse = Math.exp(-beatPhase * 8);

  dummy.position.set(...obj.position);
  dummy.position.y += pulse * 3 * scale;
  dummy.rotation.x += speed * (1 + pulse * 3);
  dummy.rotation.y += speed * (1 + pulse * 3);
  dummy.scale.setScalar(scale * (1 + pulse * 0.8));

  dummy.position.x += (mouseState.x - dummy.position.x) * 0.01;
  dummy.position.y += (mouseState.y - dummy.position.y) * 0.01;
```

Music color (quantized beat colors):
```ts
} else if (mode === 'music') {
  const beatColor = Math.floor(((t * 130) / 60) % 4) / 4;
  ref.current.setColorAt(i, new THREE.Color().setHSL(beatColor, 1, 0.5));
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Hovering "Music" makes objects pulse rhythmically — sharp scale-up on each beat with exponential decay. Colors snap between 4 hues.

**Step 3: Commit**

```bash
git add src/components/3js/Crazy.tsx
git commit -m "feat: rhythmic pulsing on Music hover"
```

---

### Task 5: Imagery hover — Total Madness

**Files:**
- Modify: `src/components/3js/Crazy.tsx` — add imagery branch to useFrame

**Step 1: Add imagery mode branch**

Add `else if (mode === 'imagery')` branch:

```ts
} else if (mode === 'imagery') {
  // MADNESS — everything cranked to 11
  dummy.position.x =
    obj.position[0] + Math.sin(Date.now() / 50 + offset) * 8;
  dummy.position.y =
    obj.position[1] + Math.cos(Date.now() / 50 + offset) * 8;
  dummy.position.z =
    obj.position[2] + Math.sin(Date.now() / 70 + offset) * 8;
  dummy.rotation.x += 0.5;
  dummy.rotation.y += 0.5;
  dummy.rotation.z += 0.5;
  dummy.scale.setScalar(
    scale * (1 + Math.sin(Date.now() / 100 + offset) * 1.5)
  );

  dummy.position.x += (mouseState.x - dummy.position.x) * 0.01;
  dummy.position.y += (mouseState.y - dummy.position.y) * 0.01;
```

Imagery color (random every frame — the original chaotic behavior):
```ts
} else if (mode === 'imagery') {
  ref.current.setColorAt(i, new THREE.Color(getRandomColor()));
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Hovering "Imagery" causes absolute chaos — wild oscillations, random colors every frame, fast camera, fast background cycling.

**Step 3: Commit**

```bash
git add src/components/3js/Crazy.tsx
git commit -m "feat: total madness on Imagery hover"
```

---

### Task 6: Words hover — Gravitational Collapse

**Files:**
- Modify: `src/components/3js/Crazy.tsx` — add words branch to useFrame

**Step 1: Add words mode branch**

Add `else if (mode === 'words')` branch:

```ts
} else if (mode === 'words') {
  // Gravitational collapse — spiral inward, stretch, reform
  const totalIdx = seed * count + i;
  const normalizedIdx = totalIdx / (OBJECTS_PER_TYPE * 5);

  // Spiral parameters
  const collapseSpeed = 0.3;
  const angle = normalizedIdx * Math.PI * 20 + t * (collapseSpeed + speed);
  const breathe = Math.sin(t * 0.5) * 0.5 + 0.5; // 0-1 pulsing
  const baseRadius = 5 + normalizedIdx * 20;
  const radius = baseRadius * (0.3 + breathe * 0.7);
  const height = (normalizedIdx - 0.5) * 40;

  dummy.position.x = Math.cos(angle) * radius;
  dummy.position.z = Math.sin(angle) * radius;
  dummy.position.y = height + Math.sin(t * 0.8 + totalIdx * 0.05) * 3;

  // Stretch along velocity (tangent direction)
  const stretchFactor = 1 + (1 - breathe) * 2;
  dummy.scale.set(scale * 0.6 * stretchFactor, scale * 0.6, scale * 0.6);

  // Face direction of travel
  dummy.rotation.y = angle + Math.PI / 2;
  dummy.rotation.x = t * 0.2;
  dummy.rotation.z = normalizedIdx * Math.PI;

  // No mouse attraction in words mode
```

Words color (monochrome purple/indigo gradient):
```ts
} else if (mode === 'words') {
  const h = 0.7 + normalizedIdx * 0.15;
  ref.current.setColorAt(
    i,
    new THREE.Color().setHSL(h, 0.6, 0.4 + breathe * 0.2)
  );
```

Note: `normalizedIdx` and `breathe` need to be accessible in the color section. Structure the code so the position and color logic for words mode are together, or compute these values before the position/color branching.

**Step 2: Verify**

Run: `npm run dev`
Expected: Hovering "Words" causes objects to form a spiraling vortex that breathes in and out. Objects stretch as they accelerate inward, reform as the vortex expands. Purple/indigo palette. Mesmerizing.

**Step 3: Commit**

```bash
git add src/components/3js/Crazy.tsx
git commit -m "feat: gravitational collapse on Words hover"
```

---

### Task 7: Final verification and cleanup

**Step 1: Run type check and lint**

```bash
npm run check-types && npm run lint
```

Fix any issues.

**Step 2: Build check**

```bash
npm run build-prod
```

**Step 3: Visual testing on dev server**

Run: `npm run dev`

Test each hover:
- Default: calm, slow floating
- Code: green neural connections
- Music: rhythmic 130 BPM pulsing
- Imagery: total madness
- Words: gravitational vortex

Test transitions: hover in/out quickly between items.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: hover-reactive 3D backgrounds complete"
```
