import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "./HomeEntrance.module.css";
import LoadingVisual from "./LoadingVisual";

// Re-entering the homepage through the menu should not replay the entrance.
// A full reload starts a fresh module and waits for its own assets again.
let revealed = false;

export default function HomeEntrance({
  ready,
  children,
}: {
  ready: boolean;
  children: ReactNode;
}) {
  const content = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">(() =>
    revealed ? "done" : "loading",
  );
  const [assetsReady, setAssetsReady] = useState(false);
  const active = phase !== "done";

  useEffect(() => {
    if (!active) return undefined;
    const element = content.current;
    if (element) element.inert = true;
    return () => {
      if (element) element.inert = false;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;
    let disposed = false;
    let fontsReady = false;
    let pageReady = document.readyState === "complete";
    const check = () => {
      if (!disposed && fontsReady && pageReady) setAssetsReady(true);
    };
    const loaded = () => {
      pageReady = true;
      check();
    };
    window.addEventListener("load", loaded, { once: true });
    void document.fonts.ready.then(() => {
      fontsReady = true;
      check();
    });

    // A failed download or unavailable GPU must never trap visitors here.
    const timeout = window.setTimeout(() => setPhase("leaving"), 10000);
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      window.removeEventListener("load", loaded);
    };
  }, [active]);

  useEffect(() => {
    if (ready && assetsReady && phase === "loading") setPhase("leaving");
  }, [ready, assetsReady, phase]);

  const finish = () => {
    revealed = true;
    setPhase("done");
  };

  useEffect(() => {
    if (phase !== "leaving") return undefined;
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 650;
    const timeout = window.setTimeout(finish, duration);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  return (
    <>
      <div ref={content} aria-busy={active}>
        {children}
      </div>
      {active && (
        <div
          className={styles.overlay}
          data-home-intro
          data-phase={phase}
          role="status"
          aria-label="Loading site"
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "opacity" &&
              phase === "leaving"
            )
              finish();
          }}
        >
          <div className={styles.center}>
            <div className={styles.visual}>
              <LoadingVisual variant="bloom" />
            </div>
            <div className={styles.loading} aria-hidden="true">
              loading<span>...</span>
            </div>
          </div>
          <div className={styles.signature} aria-hidden="true">
            <span>vid</span>
            <span>vid</span>
            <span>vid</span>
          </div>
        </div>
      )}
      <noscript>
        <style>{`[data-home-intro]{display:none!important}body{overflow:auto!important}`}</style>
      </noscript>
    </>
  );
}
