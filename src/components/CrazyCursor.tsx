import { useEffect, useRef } from 'react';

const C = [
  '#FF3366', '#FF6633', '#FFCC00', '#33FF66', '#00CCFF',
  '#6633FF', '#FF33CC', '#33FFCC', '#FF9900', '#00FF99',
];

type P = {
  x: number; y: number; vx: number; vy: number;
  sz: number; c: string; life: number; ml: number;
};
type Ring = { x: number; y: number; hue: number };

export type CursorMode = 'home' | 'code' | 'music' | 'imagery' | 'words';

type ModeConfig = {
  ringN: number;
  ringEase: number;
  spawnRate: number;
  gravity: number;
  burstN: number;
  particleSz: [number, number];
  particleVy: number;
  particleSpread: number;
  cursorShape: 'asterisk' | 'ring' | 'dot' | 'cross' | 'quill';
  cursorSize: number;
  hueSpeed: number;
  glowRadius: number;   // soft halo radius (0 = none)
  glowAlpha: number;    // halo intensity
  blendMode: string;    // CSS mix-blend-mode
  ringSz: number;       // ring dot size multiplier
};

const MODES: Record<CursorMode, ModeConfig> = {
  home: {
    ringN: 18, ringEase: 0.16, spawnRate: 1, gravity: 0.03,
    burstN: 28, particleSz: [2, 4], particleVy: -1.8,
    particleSpread: 12, cursorShape: 'ring', cursorSize: 14,
    hueSpeed: 2, glowRadius: 120, glowAlpha: 0.25,
    blendMode: 'screen', ringSz: 1.6,
  },
  code: {
    ringN: 14, ringEase: 0.18, spawnRate: 2, gravity: 0.04,
    burstN: 20, particleSz: [1.5, 2.5], particleVy: -1.5,
    particleSpread: 8, cursorShape: 'asterisk', cursorSize: 10,
    hueSpeed: 1.5, glowRadius: 50, glowAlpha: 0.12,
    blendMode: 'screen', ringSz: 1,
  },
  music: {
    ringN: 10, ringEase: 0.22, spawnRate: 1, gravity: -0.02,
    burstN: 16, particleSz: [2, 4], particleVy: -2.5,
    particleSpread: 14, cursorShape: 'ring', cursorSize: 12,
    hueSpeed: 3, glowRadius: 80, glowAlpha: 0.18,
    blendMode: 'screen', ringSz: 1.2,
  },
  imagery: {
    ringN: 8, ringEase: 0.12, spawnRate: 3, gravity: 0,
    burstN: 24, particleSz: [3, 6], particleVy: 0,
    particleSpread: 20, cursorShape: 'dot', cursorSize: 6,
    hueSpeed: 2, glowRadius: 90, glowAlpha: 0.2,
    blendMode: 'screen', ringSz: 1.3,
  },
  words: {
    ringN: 6, ringEase: 0.25, spawnRate: 4, gravity: 0.08,
    burstN: 8, particleSz: [1, 2], particleVy: 0.5,
    particleSpread: 3, cursorShape: 'quill', cursorSize: 12,
    hueSpeed: 0.5, glowRadius: 30, glowAlpha: 0.08,
    blendMode: 'normal', ringSz: 0.8,
  },
};

const CrazyCursor = ({ mode = 'home' }: { mode?: CursorMode }) => {
  const cvs = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let mx = -200, my = -200;
    let particles: P[] = [];
    let raf = 0;
    let lastT = 0;
    let frame = 0;

    // Track velocity for motion-based effects
    let prevMx = -200, prevMy = -200;
    let vel = 0;

    const MAX_RINGS = 20;
    const rings: Ring[] = [];
    for (let i = 0; i < MAX_RINGS; i++) rings.push({ x: -200, y: -200, hue: (i * 360) / MAX_RINGS });

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const onClick = (e: MouseEvent) => {
      const m = MODES[modeRef.current];
      for (let i = 0; i < m.burstN; i++) {
        const a = (Math.PI * 2 * i) / m.burstN + Math.random() * 0.3;
        const spd = 2 + Math.random() * 6;
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          sz: m.particleSz[0] + Math.random() * (m.particleSz[1] + 3),
          c: C[Math.floor(Math.random() * C.length)]!,
          life: 1, ml: 0.4 + Math.random() * 0.6,
        });
      }
    };

    function drawGlow(m: ModeConfig, now: number) {
      if (mx < 0 || m.glowRadius <= 0) return;

      // Pulsing glow radius based on velocity + breathing
      const breathe = 1 + Math.sin(now * 0.003) * 0.1;
      const velBoost = Math.min(1, vel / 15);
      const r = m.glowRadius * breathe * (1 + velBoost * 0.5);
      const alpha = m.glowAlpha * (0.8 + velBoost * 0.4);

      const hue = (frame * 2) % 360;
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      grad.addColorStop(0, `hsla(${hue}, 100%, 70%, ${alpha})`);
      grad.addColorStop(0.3, `hsla(${(hue + 40) % 360}, 100%, 60%, ${alpha * 0.5})`);
      grad.addColorStop(0.7, `hsla(${(hue + 80) % 360}, 100%, 50%, ${alpha * 0.15})`);
      grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(mx - r, my - r, r * 2, r * 2);
    }

    function drawCursor(m: ModeConfig, now: number) {
      if (mx < 0) return;
      ctx.save();
      ctx.translate(mx, my);

      switch (m.cursorShape) {
        case 'asterisk': {
          const rot = now * 0.002;
          ctx.rotate(rot);
          const arms = 6;
          for (let i = 0; i < arms; i++) {
            const angle = (Math.PI * 2 * i) / arms;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 2, Math.sin(angle) * 2);
            ctx.lineTo(Math.cos(angle) * m.cursorSize, Math.sin(angle) * m.cursorSize);
            ctx.strokeStyle = `hsla(${(frame * 4 + i * 60) % 360}, 100%, 75%, 0.9)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          break;
        }
        case 'ring': {
          const pulse = 1 + Math.sin(now * 0.004) * 0.15;
          // Outer ring
          ctx.beginPath();
          ctx.arc(0, 0, m.cursorSize * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${(frame * 3) % 360}, 100%, 75%, 0.8)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Inner ring
          ctx.beginPath();
          ctx.arc(0, 0, m.cursorSize * pulse * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${(frame * 3 + 120) % 360}, 100%, 80%, 0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Center
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          break;
        }
        case 'dot': {
          const pulse = 1 + Math.sin(now * 0.003) * 0.2;
          ctx.beginPath();
          ctx.arc(0, 0, m.cursorSize * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${(frame * 2) % 360}, 80%, 65%, 0.5)`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          break;
        }
        case 'cross': {
          const s = m.cursorSize;
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
          ctx.moveTo(0, -s); ctx.lineTo(0, s);
          ctx.stroke();
          break;
        }
        case 'quill': {
          ctx.rotate(-0.4);
          ctx.beginPath();
          ctx.moveTo(0, -m.cursorSize);
          ctx.quadraticCurveTo(3, -m.cursorSize * 0.4, 1, 0);
          ctx.quadraticCurveTo(-1, -m.cursorSize * 0.3, 0, -m.cursorSize);
          ctx.fillStyle = `hsla(${(frame * 0.5) % 360}, 60%, 75%, 0.8)`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(1, 1, 1, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          break;
        }
      }
      ctx.restore();
    }

    function render(now: number) {
      const dt = Math.min(0.033, (now - lastT) / 1000);
      lastT = now;
      frame++;
      const m = MODES[modeRef.current];

      // Track mouse velocity
      const dx = mx - prevMx;
      const dy = my - prevMy;
      vel = vel * 0.85 + Math.sqrt(dx * dx + dy * dy) * 0.15;
      prevMx = mx;
      prevMy = my;

      // Update blend mode
      canvas!.style.mixBlendMode = m.blendMode;

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw glow halo FIRST (behind everything)
      drawGlow(m, now);

      // Update rings
      const activeRings = m.ringN;
      for (let i = 0; i < MAX_RINGS; i++) {
        const r = rings[i]!;
        if (i >= activeRings) { r.x = -200; r.y = -200; continue; }
        const tx = i === 0 ? mx : rings[i - 1]!.x;
        const ty = i === 0 ? my : rings[i - 1]!.y;
        const ease = m.ringEase - i * 0.006;
        r.x += (tx - r.x) * Math.max(0.03, ease);
        r.y += (ty - r.y) * Math.max(0.03, ease);
        r.hue = (r.hue + m.hueSpeed) % 360;
      }

      // Draw rings
      if (mx > 0) {
        for (let i = activeRings - 1; i >= 0; i--) {
          const r = rings[i]!;
          const t = 1 - i / activeRings;
          const sz = (2 + t * 5) * m.ringSz;
          const alpha = 0.12 + t * 0.5;
          ctx.beginPath();
          ctx.arc(r.x, r.y, sz, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${r.hue}, 100%, 65%, ${alpha})`;
          ctx.fill();
          if (i < activeRings - 1) {
            const next = rings[i + 1]!;
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `hsla(${r.hue}, 100%, 65%, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Spawn particles (more when moving fast)
      const spawnBoost = modeRef.current === 'home' ? Math.floor(vel / 8) : 0;
      const effectiveRate = Math.max(1, m.spawnRate - spawnBoost);
      if (mx > 0 && frame % effectiveRate === 0) {
        const count = modeRef.current === 'home' ? 1 + Math.floor(vel / 12) : 1;
        for (let n = 0; n < count; n++) {
          particles.push({
            x: mx + (Math.random() - 0.5) * m.particleSpread,
            y: my + (Math.random() - 0.5) * m.particleSpread,
            vx: (Math.random() - 0.5) * 1.5 + dx * 0.1,
            vy: m.particleVy * (0.5 + Math.random()) + dy * 0.1,
            sz: m.particleSz[0] + Math.random() * m.particleSz[1],
            c: `hsl(${(frame * 3 + n * 40) % 360}, 100%, 65%)`,
            life: 1,
            ml: 0.25 + Math.random() * 0.4,
          });
        }
      }

      // Update & draw particles
      particles = particles.filter((p) => {
        p.life -= dt / p.ml;
        if (p.life <= 0) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += m.gravity;
        p.vx *= 0.995;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz * p.life, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;

      drawCursor(m, now);
      raf = requestAnimationFrame(render);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default CrazyCursor;
