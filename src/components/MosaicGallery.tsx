import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './MosaicGallery.module.css';

export type MosaicItem = {
  image?: string;
  youtubeId?: string;
  description: string;
};

type CardPos = { idx: number; x: number; y: number; w: number; h: number };

const FP = 4; // frame padding
const GAP = 6; // space between cards
const RES = 2; // heightmap resolution

// Cycling width offsets — prevent similar-aspect images from getting same width
const W_VARY = [0.0, 0.55, 0.25, 0.8, 0.4, 0.65, 0.1, 0.9, 0.35, 0.7, 0.15, 0.5, 0.85, 0.3, 0.6];

function loadAspects(items: MosaicItem[]): Promise<number[]> {
  return Promise.all(
    items.map(
      (item) =>
        new Promise<number>((resolve) => {
          if (item.youtubeId) return resolve(9 / 16);
          if (!item.image) return resolve(1);
          const img = new Image();
          img.onload = () =>
            resolve(img.naturalHeight / img.naturalWidth || 1);
          img.onerror = () => resolve(1);
          img.src = item.image;
        }),
    ),
  );
}

function computeLayout(
  aspects: number[],
  cw: number,
): { cards: CardPos[]; totalH: number } {
  const totalCols = Math.ceil(cw / RES);
  const hm = new Float64Array(totalCols);
  const cards: CardPos[] = [];
  const minW = Math.max(100, cw * 0.14);
  const maxW = cw * 0.38; // forces 3+ cards across, prevents 2-column lock
  const tol = 4;

  for (let i = 0; i < aspects.length; i++) {
    // Find lowest point
    let loH = Infinity;
    let loC = 0;
    for (let c = 0; c < totalCols; c++) {
      if (hm[c]! < loH) {
        loH = hm[c]!;
        loC = c;
      }
    }

    // Extend gap from lowest point
    let gs = loC;
    let ge = loC;
    while (ge < totalCols && hm[ge]! <= loH + tol) ge++;
    while (gs > 0 && hm[gs - 1]! <= loH + tol) gs--;

    const gapW = (ge - gs) * RES;

    // Card width: fill the gap exactly if it's a good size,
    // otherwise take a varied portion
    let cardW: number;
    if (gapW >= minW && gapW <= maxW) {
      cardW = gapW;
    } else if (gapW > maxW) {
      // Mix aspect ratio + cycling offset for true variety
      const a = aspects[i]!;
      const base = Math.max(0, Math.min(1, 1 - (a - 0.5) / 1.5));
      const vary = W_VARY[i % W_VARY.length]!;
      const t = (base * 0.4 + vary * 0.6) % 1;
      cardW = Math.round(minW + t * (maxW - minW));
      // Only snap to gap if leftover would be truly unusable
      if (gapW - cardW < cw * 0.08) cardW = gapW;
    } else {
      cardW = Math.round(minW);
      if (gapW > 0 && gapW >= cw * 0.08) cardW = gapW;
    }

    const cardCols = Math.min(Math.ceil(cardW / RES), totalCols);
    const startCol = Math.max(0, Math.min(gs, totalCols - cardCols));
    const endCol = Math.min(startCol + cardCols, totalCols);

    // Actual y = max height in this card's footprint
    let y = 0;
    for (let c = startCol; c < endCol; c++) {
      if (hm[c]! > y) y = hm[c]!;
    }

    const w = (endCol - startCol) * RES;
    const innerW = w - FP * 2;
    const h = Math.round(innerW * (aspects[i] ?? 1)) + FP * 2;

    cards.push({ idx: i, x: startCol * RES + GAP / 2, y: y + GAP / 2, w: w - GAP, h: h - GAP });

    for (let c = startCol; c < endCol; c++) hm[c] = y + h;
  }

  let maxH = 0;
  for (let c = 0; c < totalCols; c++) if (hm[c]! > maxH) maxH = hm[c]!;
  return { cards, totalH: maxH };
}

const MosaicGallery = ({ items }: { items: MosaicItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<CardPos[]>([]);
  const [totalH, setTotalH] = useState(0);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let dead = false;

    loadAspects(items).then((aspects) => {
      if (dead) return;
      const compute = () => {
        if (dead || !el) return;
        const { cards: c, totalH: h } = computeLayout(aspects, el.clientWidth);
        setCards(c);
        setTotalH(h);
        setReady(true);
      };
      compute();
      window.addEventListener('resize', compute);
      return () => window.removeEventListener('resize', compute);
    });

    return () => {
      dead = true;
    };
  }, [items]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (selected) d.showModal();
    else d.close();
  }, [selected]);

  const colorsRef = useRef(
    items.map(() =>
      Array.from(
        { length: 5 },
        () => `hsl(${Math.random() * 360}, 100%, 70%)`,
      ),
    ),
  );

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={`${styles.container} ${ready ? styles.ready : ''}`}
      >
        <div className={styles.mosaic} style={{ height: totalH }}>
          {cards.map((card, ci) => {
            const item = items[card.idx]!;
            const c = colorsRef.current[card.idx]!;
            return (
              <div
                key={card.idx}
                className={`${styles.card} frame`}
                style={
                  {
                    left: card.x,
                    top: card.y,
                    width: card.w,
                    height: card.h,
                    '--color-1': c[0],
                    '--color-2': c[1],
                    '--color-3': c[2],
                    '--color-4': c[3],
                    '--color-5': c[4],
                    transitionDelay: `${Math.min(ci * 18, 500)}ms`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={styles.cardInner}
                  onClick={() => item.image && setSelected(item.image)}
                >
                  {item.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}`}
                      allowFullScreen
                      title="Video"
                      className={styles.video}
                    />
                  ) : (
                    <img src={item.image} alt="" className={styles.media} />
                  )}
                  <div className={styles.descOverlay}>
                    <span>{item.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <dialog
            ref={dialogRef}
            onClose={() => setSelected(null)}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
            className={styles.dialog}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            {selected && (
              <img src={selected} alt="" className={styles.dialogImg} />
            )}
          </dialog>,
          document.body,
        )}
    </div>
  );
};

export default MosaicGallery;
