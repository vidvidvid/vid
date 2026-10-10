import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";

import { LinkIcon } from "@/components/icons/LinkIcon";
import type { LivingMode } from "@/components/living/LivingArtwork";
import MenuDissolve from "@/components/living/MenuDissolve";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";

import styles from "./index.module.css";

const LivingArtwork = dynamic(
  () => import("@/components/living/LivingArtwork"),
  { ssr: false },
);
const sections: { label: string; mode: LivingMode; detail: string }[] = [
  { label: "code", mode: "code", detail: "projects" },
  { label: "music", mode: "music", detail: "mala roza muca" },
  { label: "imagery", mode: "imagery", detail: "drawings & video" },
  { label: "words", mode: "words", detail: "prose & poetry" },
];

const Index = () => {
  const home = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<LivingMode>("code");
  const [hoveredMode, setHoveredMode] = useState<LivingMode | null>(null);
  const [focusedMode, setFocusedMode] = useState<LivingMode | null>(null);
  const [paused, setPaused] = useState(false);
  const [variation, setVariation] = useState(0);
  const reshape = () => {
    setVariation((value) => value + 1);
    setMode(
      (value) =>
        sections[
          (sections.findIndex((section) => section.mode === value) + 1) %
            sections.length
        ]!.mode,
    );
  };
  return (
    <Main
      meta={
        <Meta
          title="vidvidvid"
          description="Code, music, imagery, words. Vid’s personal website."
        />
      }
    >
      <div
        ref={home}
        className={styles.home}
        data-living-home
        data-mode={mode}
        data-palette={mode}
        data-paused={paused}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--cursor-x",
            `${((event.clientX - bounds.left) / bounds.width - 0.5) * 2}`,
          );
          event.currentTarget.style.setProperty(
            "--cursor-y",
            `${((event.clientY - bounds.top) / bounds.height - 0.5) * 2}`,
          );
        }}
        onPointerLeave={() => {
          home.current?.style.setProperty("--cursor-x", "0");
          home.current?.style.setProperty("--cursor-y", "0");
        }}
      >
        <div className={styles.atmosphere} aria-hidden="true" />
        <div className={styles.body}>
          <nav className={styles.navigation} aria-label="Explore">
            {sections.map((section, index) => (
              <Link
                key={section.mode}
                href={`/${section.mode}`}
                className={styles.sectionLink}
                data-palette={section.mode}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch")
                    setHoveredMode(section.mode);
                  setMode(section.mode);
                }}
                onPointerLeave={() => setHoveredMode(null)}
                onFocus={() => {
                  setFocusedMode(section.mode);
                  setMode(section.mode);
                }}
                onBlur={() => setFocusedMode(null)}
              >
                <span className={styles.number}>0{index + 1}</span>
                <span className={styles.linkWindow}>
                  <span className={styles.linkName} data-menu-label>
                    {section.label}
                  </span>
                </span>
                <MenuDissolve
                  label={section.label}
                  mode={section.mode}
                  active={(hoveredMode ?? focusedMode) === section.mode}
                  paused={paused}
                />
                <span className={styles.patternLabel} aria-hidden="true">
                  {section.label}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  <LinkIcon kind={section.mode} />
                </span>
                <span className={styles.detail}>{section.detail}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.stage}>
            <LivingArtwork
              mode={mode}
              activeMode={hoveredMode ?? focusedMode}
              paused={paused}
              variation={variation}
              onReshape={reshape}
            />
            <div className={styles.stageBottom}>
              <span>drag · hold · let go</span>
              <div>
                <button onClick={reshape} data-cursor="reshape">
                  reshape
                </button>
                <button
                  onClick={() => setPaused((value) => !value)}
                  aria-pressed={paused}
                  aria-label={paused ? "Resume motion" : "Pause motion"}
                  data-cursor={paused ? "play" : "pause"}
                >
                  {paused ? "play" : "pause"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className={styles.bottomline}>
          <span>© vid</span>
          <div className={styles.signal} aria-hidden="true">
            {Array.from({ length: 48 }, (_, index) => (
              <i key={index} style={{ "--i": index } as React.CSSProperties} />
            ))}
          </div>
          <span className={styles.edition}>2026</span>
        </footer>
      </div>
    </Main>
  );
};
export default Index;
