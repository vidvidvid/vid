import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import StripButton from '@/components/StripButton';

import styles from './EpilepsyTrigger.module.css';

type EpilepsyTriggerProps = {
  title: string;
  location: string;
  stripColor: string;
};

const EpilepsyTrigger = ({ title, location, stripColor }: EpilepsyTriggerProps) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const dialogContent = (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      className={styles.dialogContent}
    >
      <div className={styles.dialogTitle}>EPILEPSY WARNING</div>
      <button className={styles.closeButton} onClick={() => setOpen(false)}>
        ✕
      </button>
      <div className={styles.dialogBody}>
        Flashing stuff incoming. If you have epilepsy, please{' '}
        <span className={styles.doNot}>do not</span>{' '}
        click
        <button
          className={styles.hereButton}
          onClick={() => {
            window.location.href = `/${location}`;
          }}
        >
          here
        </button>
      </div>
    </dialog>
  );

  return (
    <>
      <StripButton
        label={title}
        mode="imagery"
        stripColor={stripColor}
        onClick={() => setOpen(true)}
      />
      {typeof document !== 'undefined' && createPortal(dialogContent, document.body)}
    </>
  );
};

export default EpilepsyTrigger;
