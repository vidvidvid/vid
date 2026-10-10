import { useEffect, useRef, useState } from "react";

import { LinkIcon } from "@/components/icons/LinkIcon";
import artworkPreviews from "@/generated/artwork-previews.json";

import styles from "./MosaicGallery.module.css";

export type MosaicItem = {
  image?: string;
  width?: number;
  height?: number;
  youtubeId?: string;
  description: string;
};

const MosaicGallery = ({ items }: { items: MosaicItem[] }) => {
  const previews: Record<
    string,
    { src: string; srcSet: string; width: number; height: number }
  > = artworkPreviews;
  const [selected, setSelected] = useState<MosaicItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selected]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((item, index) => {
          const preview = item.image ? previews[item.image] : undefined;
          return (
            <figure key={item.image ?? item.youtubeId} className={styles.card}>
              {item.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  loading="lazy"
                  allowFullScreen
                  title={item.description}
                  className={styles.video}
                />
              ) : (
                <button
                  onClick={() => setSelected(item)}
                  className={styles.imageButton}
                  data-cursor="expand"
                  aria-label={`View artwork ${index + 1}: ${item.description}`}
                >
                  <img
                    src={preview?.src ?? item.image}
                    srcSet={preview?.srcSet}
                    sizes="(max-width: 500px) 88vw, (max-width: 900px) calc((88vw - 18px) / 2), (max-width: 1920px) calc((88vw - 52px) / 3), 546px"
                    width={preview?.width ?? item.width}
                    height={preview?.height ?? item.height}
                    alt={item.description}
                    loading="lazy"
                    className={styles.media}
                  />
                  <span className={styles.expand} aria-hidden="true">
                    <LinkIcon kind="expand" />
                  </span>
                </button>
              )}
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.description}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
        className={styles.dialog}
        aria-label="Artwork preview"
      >
        <button
          className={styles.closeBtn}
          onClick={() => setSelected(null)}
          aria-label="Close artwork"
        >
          ✕
        </button>
        {selected && (
          <>
            <img
              src={selected.image}
              width={
                (selected.image && previews[selected.image]?.width) ||
                selected.width
              }
              height={
                (selected.image && previews[selected.image]?.height) ||
                selected.height
              }
              alt={selected.description}
              className={styles.dialogImg}
            />
            <p>{selected.description}</p>
          </>
        )}
      </dialog>
    </div>
  );
};
export default MosaicGallery;
