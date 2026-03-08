# Hover-Reactive 3D Backgrounds

## Mechanism

Shared module-level `hoverState` object (like existing `mouseState`). Index page sets it on mouseenter/mouseleave. Three.js `useFrame` reads it each frame — no React re-renders.

## Modes

### Default (no hover) — Calm
- Slow rotations (30% of current speed)
- Gentle floating (reduced amplitude)
- No "crazy" triggers
- Colors set once per object, slowly cycle hue
- Camera rotates at half speed
- Background color cycles slowly

### Code — Neural Network
- Objects cluster slightly (stronger mouse attraction)
- Colors shift to green/cyan spectrum
- New `NeuralConnections` component: `LineSegments` between nearby objects via random sampling (~200 lines/frame). Glowing green lines with additive blending.
- Instance positions stored in shared `Float32Array`

### Music — Rhythmic
- 130 BPM beat: `Math.exp(-beatPhase * 8)` exponential decay pulse
- Objects scale up sharply on beat, then decay
- Colors snap-change per beat (quantized)
- Camera subtle zoom pulse on beat

### Imagery — Total Madness
- ALL objects permanent "crazy" mode
- Max rotation speed, wild position oscillation
- Random color every frame
- Background cycles 5x speed
- Camera rotation speeds up dramatically

### Words — Gravitational Collapse
- Objects pull toward center with increasing force
- Stretch/elongate along velocity vector
- Teleport back to outer ring when near center
- Monochrome purple/indigo palette
- Pulsing collapse-and-reform cycle
- Camera near-still

## Files Changed
- `src/components/3js/Crazy.tsx`: hoverState export, instancePositions, mode-branching in useFrame, NeuralConnections component, mode-aware camera/background
- `src/pages/index.tsx`: import hoverState, onMouseEnter/onMouseLeave handlers
