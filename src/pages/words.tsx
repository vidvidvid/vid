import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Reader from '@/components/Reader';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './words.module.css';

const Words = () => {
  const [open, setOpen] = useState(false);

  const books = [
    { title: 'Starec', pdf: 'Starec', subtitle: '2020' },
    { title: 'Sveta Knjiga', subtitle: 'Lepe Marke, Kakadu & Moja soba', pdf: 'svetaknjiga' },
    { title: 'Jajce', subtitle: '2015, unfinished', pdf: 'jajce' },
    { title: 'Zgodbice za odrasle', subtitle: '2016', pdf: 'zgodbicezaodrasle' },
    { title: 'Dolga, dolga je pot do zvezd', subtitle: '2021, unfinished', pdf: 'dolga' },
    { title: 'Grde Papilone', subtitle: '2022', pdf: 'grdepapilone' },
    { title: 'Nekoc Surina', subtitle: '2018, unfinished', pdf: 'NekocSurina' },
    { title: 'Sem Iskal', subtitle: '2012', pdf: 'Sem iskal' },
    { title: 'V bistvu sem budist', subtitle: '2021', pdf: 'vbistvu' },
  ];

  const poetry = [
    { title: 'Predvčerajšnjim', pdf: 'predvcerajsnjim', subtitle: ' - 2013' },
    { title: 'Včeraj', pdf: 'vceraj', subtitle: '2013 - 2016' },
    { title: 'Pojutrišnjem', pdf: 'pojutrisnjem', subtitle: '2016 - 2019' },
    { title: 'Popojutrišnjem', pdf: 'popojutrisnjem', subtitle: '2019 - ' },
  ];

  const [bookIndex, setBookIndex] = useState<number>(0);
  const [poetryIndex, setPoetryIndex] = useState<number>(0);
  const [isViewingPoetry, setIsViewingPoetry] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPagez, setNumPagez] = useState<number>(0);

  const handlePrevPage = () => {
    setCurrentPage((currPage) => Math.max(currPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((currPage) => Math.min(currPage + 1, numPagez));
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 480);
  }, []);

  const drawerContent = (
    <>
      {open && (
        <div className={styles.drawerBackdrop} onClick={() => setOpen(false)} />
      )}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <button className={styles.drawerClose} onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className={styles.drawerHeader}>Library</div>

        <p className={styles.sectionTitle}>Prose</p>
        <div className={styles.bookList}>
          {books.map(({ title, subtitle }, index) => (
            <div
              key={title}
              className={styles.bookItem}
              onClick={() => {
                setBookIndex(index);
                setIsViewingPoetry(false);
                setOpen(false);
                setCurrentPage(1);
              }}
            >
              <span>{title}</span>
              {subtitle && (
                <span className={styles.bookSubtitle}>({subtitle})</span>
              )}
            </div>
          ))}
        </div>

        <p className={styles.sectionTitleSpaced}>Poetry</p>
        <div className={styles.bookList}>
          {poetry.map(({ title, subtitle }, index) => (
            <div
              key={title}
              className={styles.bookItem}
              onClick={() => {
                setPoetryIndex(index);
                setIsViewingPoetry(true);
                setOpen(false);
                setCurrentPage(1);
              }}
            >
              <span>{title}</span>
              {subtitle && (
                <span className={styles.bookSubtitle}>({subtitle})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Main meta={<Meta title="Words" description="My words" />}>
      <button className={styles.libraryButton} onClick={() => setOpen(true)}>
        <img
          src="/assets/images/book.png"
          className={styles.libraryIcon}
          alt="library"
        />
        Library
      </button>

      {typeof document !== 'undefined' && createPortal(drawerContent, document.body)}

      {isMobile ? (
        <div className={styles.mobileMessage}>
          <p>Not available on mobile. Please view on desktop.</p>
        </div>
      ) : (
        <Reader
          url={`/assets/pdf/${
            isViewingPoetry ? poetry[poetryIndex]?.pdf : books[bookIndex]?.pdf
          }.pdf`}
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          setNumPagez={setNumPagez}
          numPagez={numPagez}
        />
      )}
    </Main>
  );
};

export default Words;
