import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { LinkIcon } from "@/components/icons/LinkIcon";

import styles from "./Reader.module.css";

interface ReaderProps {
  url: string;
  currentPage: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  numPagez: number;
  setNumPagez: (num: number) => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Direction = -1 | 1;
type Turn = {
  direction: Direction;
  phase: "dragging" | "preparing" | "settling";
};

const Reader = ({
  url,
  currentPage,
  handleNextPage,
  handlePrevPage,
  numPagez,
  setNumPagez,
}: ReaderProps) => {
  const container = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    rejected: boolean;
  } | null>(null);
  const turnRef = useRef<Turn | null>(null);
  const progress = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef(0);
  const suppressClick = useRef(false);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [ready, setReady] = useState<Set<number>>(new Set());
  const [width, setWidth] = useState(600);
  const [pageRatio, setPageRatio] = useState(Math.SQRT2);

  const updateTurn = (value: Turn | null) => {
    turnRef.current = value;
    setTurn(value);
  };
  const updateProgress = (value: number) => {
    progress.current = value;
    book.current?.style.setProperty("--turn", String(value));
  };
  const canTurn = (direction: Direction) => {
    const target = currentPage + direction;
    return target >= 1 && target <= numPagez && ready.has(target);
  };
  const settle = (direction: Direction, complete: boolean) => {
    if (turnRef.current && turnRef.current.phase !== "dragging") return;
    updateTurn({ direction, phase: "preparing" });
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // A hidden leaf must reach its folded pose before its transition starts.
    // Starting from flat made backward turns look like a brightness flicker.
    frame.current = requestAnimationFrame(() => {
      book.current?.querySelector("[data-fold]")?.getBoundingClientRect();
      updateTurn({ direction, phase: "settling" });
      frame.current = requestAnimationFrame(() => {
        updateProgress(complete ? 1 : 0);
        timer.current = setTimeout(
          () => {
            if (complete) {
              if (direction === 1) handleNextPage();
              else handlePrevPage();
            }
            updateTurn(null);
            updateProgress(0);
            timer.current = null;
          },
          reducedMotion ? 0 : 440,
        );
      });
    });
  };
  const turnPage = (direction: Direction) => {
    if (!turnRef.current && canTurn(direction)) settle(direction, true);
  };
  const finishGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (gesture.current?.id !== event.pointerId) return;
    gesture.current = null;
    const activeTurn = turnRef.current;
    if (activeTurn?.phase === "dragging") {
      suppressClick.current = true;
      settle(activeTurn.direction, progress.current >= 0.18);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const cancelGesture = () => {
    gesture.current = null;
    const activeTurn = turnRef.current;
    if (activeTurn?.phase === "dragging") {
      suppressClick.current = true;
      settle(activeTurn.direction, false);
    }
  };

  useEffect(() => {
    const element = container.current;
    if (!element) return undefined;
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      const availableHeight = Math.max(
        300,
        window.innerHeight - Math.max(0, bounds.top + window.scrollY) - 64,
      );
      setWidth(
        Math.floor(Math.min(760, bounds.width, availableHeight / pageRatio)),
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    window.addEventListener("resize", resize);
    resize();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [pageRatio]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    },
    [],
  );

  const pages = [currentPage - 1, currentPage, currentPage + 1].filter(
    (page) => page >= 1 && (page <= numPagez || page === currentPage),
  );

  return (
    <div className={styles.container} ref={container}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPagez(numPages)}
        loading={<p className={styles.message}>Opening the book…</p>}
        error={
          <p className={styles.message}>
            The preview couldn’t load.{" "}
            <a href={url} target="_blank" rel="noreferrer">
              Open the PDF <LinkIcon />
            </a>
          </p>
        }
      >
        <div
          ref={book}
          className={styles.book}
          style={{ width }}
          role="group"
          aria-label="Book pages"
          aria-describedby="book-gestures"
          tabIndex={0}
          data-turning={turn?.direction}
          data-settling={turn?.phase === "settling" || undefined}
          data-cursor="words"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              turnPage(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0 || turnRef.current)
              return;
            suppressClick.current = false;
            gesture.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              rejected: false,
            };
            event.currentTarget.focus({ preventScroll: true });
          }}
          onPointerMove={(event) => {
            const start = gesture.current;
            if (!start || start.id !== event.pointerId || start.rejected)
              return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (!turnRef.current) {
              if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
                start.rejected = true;
                suppressClick.current = true;
                return;
              }
              if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            }
            const direction: Direction = dx < 0 ? 1 : -1;
            if (!canTurn(direction)) {
              updateProgress(0);
              return;
            }
            if (turnRef.current?.direction !== direction) {
              updateTurn({ direction, phase: "dragging" });
            }
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            updateProgress(Math.min(0.95, (Math.abs(dx) / width) * 1.25));
          }}
          onPointerUp={finishGesture}
          onPointerCancel={cancelGesture}
          onLostPointerCapture={cancelGesture}
          onClickCapture={(event) => {
            if (suppressClick.current && event.detail > 0) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          <span id="book-gestures" className="sr-only">
            Swipe or drag left and right to turn pages. You can also click the
            page edges or use the left and right arrow keys.
          </span>
          {pages.map((page) => {
            const turning =
              turn && page === currentPage + (turn.direction === -1 ? -1 : 0);
            const underneath =
              turn && page === currentPage + (turn.direction === 1 ? 1 : 0);
            return (
              <div
                key={page}
                className={styles.leaf}
                data-current={page === currentPage || undefined}
                data-fold={turning ? turn.direction : undefined}
                data-underneath={underneath || undefined}
                aria-hidden={page !== currentPage}
              >
                <Page
                  pageNumber={page}
                  width={width}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className={styles.blankPage} />}
                  onLoadSuccess={(pdfPage) => {
                    if (page === currentPage) {
                      const dimensions = pdfPage.getViewport({ scale: 1 });
                      setPageRatio(dimensions.height / dimensions.width);
                    }
                  }}
                  onRenderSuccess={() =>
                    setReady((previous) =>
                      previous.has(page)
                        ? previous
                        : new Set([...previous, page]),
                    )
                  }
                />
              </div>
            );
          })}
          <button
            className={`${styles.pageEdge} ${styles.previous}`}
            disabled={!canTurn(-1) || !!turn}
            onClick={() => turnPage(-1)}
            aria-label="Previous page"
            data-cursor="back"
          />
          <button
            className={`${styles.pageEdge} ${styles.next}`}
            disabled={!canTurn(1) || !!turn}
            onClick={() => turnPage(1)}
            aria-label="Next page"
            data-cursor="forward"
          />
        </div>
      </Document>
      <div className={styles.readerFooter} style={{ width }}>
        <span aria-live="polite">
          {numPagez ? `${currentPage} / ${numPagez}` : "Opening…"}
        </span>
        <a
          className={styles.openPdf}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open PDF <LinkIcon />
        </a>
      </div>
    </div>
  );
};
export default Reader;
