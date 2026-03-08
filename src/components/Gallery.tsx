import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import YouTube from 'react-youtube';

import Card from './Card';
import styles from './Gallery.module.css';

type GalleryProps = {
  imagery: {
    image?: string;
    youtubeId?: string;
    description: string;
  }[];
};

const Gallery = ({ imagery }: GalleryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const breakpoint =
    typeof window !== 'undefined' && window.innerWidth < 480 ? 'base' : 'sm';

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const colors = [
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
    ];

    const el = document.querySelector('#videos') as HTMLElement;
    el.style.setProperty('--color-1', colors[0] || 'red');
    el.style.setProperty('--color-2', colors[1] || 'blue');
    el.style.setProperty('--color-3', colors[2] || 'green');
    el.style.setProperty('--color-4', colors[3] || 'yellow');
    el.style.setProperty('--color-5', colors[4] || 'purple');
  }, []);

  const opts =
    breakpoint === 'base' ? { width: '100%', height: 'auto' } : undefined;

  const dialogContent = (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      className={styles.dialogContent}
    >
      <button className={styles.closeButton} onClick={() => setOpen(false)}>
        ✕
      </button>
      {selectedImage && (
        <img
          alt="image"
          src={selectedImage}
          className={styles.dialogImage}
        />
      )}
    </dialog>
  );

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.videoRow} frame`} id="videos">
        <YouTube videoId="UdimcciEJh8" opts={opts} />
        <div className={styles.codeRow}>
          <span className={styles.code}>
            &#8592; When I was listening to this song in high school I realised
            these lyrics need to be visualised, so I did.
          </span>
          <span className={styles.code}>
            My first frame-by-frame animation. Guy farts himself to death.
            &#8594;
          </span>
        </div>
        <YouTube videoId="kPnHaL9bhGk" opts={opts} />
      </div>
      <div className={styles.grid}>
        {imagery.map(({ image, description }, index) => (
          <Card
            key={index}
            element={
              <img
                className={styles.galleryImage}
                alt="image"
                onClick={() => {
                  if (image) handleImageClick(image);
                }}
                src={image}
              />
            }
            index={index}
            description={description}
          />
        ))}
      </div>
      {typeof document !== 'undefined' && createPortal(dialogContent, document.body)}
    </div>
  );
};

export default Gallery;
