import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";

import styles from "./words.module.css";

const Reader = dynamic(() => import("@/components/Reader"), {
  ssr: false,
  loading: () => <p>Opening the book…</p>,
});
const books = [
  { title: "Starec", pdf: "Starec", subtitle: "2020" },
  {
    title: "Sveta Knjiga",
    subtitle: "Lepe Marke, Kakadu & Moja soba",
    pdf: "svetaknjiga",
  },
  { title: "Jajce", subtitle: "2015 · unfinished", pdf: "jajce" },
  { title: "Zgodbice za odrasle", subtitle: "2016", pdf: "zgodbicezaodrasle" },
  {
    title: "Dolga, dolga je pot do zvezd",
    subtitle: "2021 · unfinished",
    pdf: "dolga",
  },
  { title: "Grde Papilone", subtitle: "2022", pdf: "grdepapilone" },
  { title: "Nekoc Surina", subtitle: "2018 · unfinished", pdf: "NekocSurina" },
  { title: "Sem Iskal", subtitle: "2012", pdf: "Sem iskal" },
  { title: "V bistvu sem budist", subtitle: "2021", pdf: "vbistvu" },
];
const poetry = [
  { title: "Predvčerajšnjim", pdf: "predvcerajsnjim", subtitle: "Before 2013" },
  { title: "Včeraj", pdf: "vceraj", subtitle: "2013–2016" },
  { title: "Pojutrišnjem", pdf: "pojutrisnjem", subtitle: "2016–2019" },
  { title: "Popojutrišnjem", pdf: "popojutrisnjem", subtitle: "2019–" },
];
const shelves = [
  { title: "Prose", items: books },
  { title: "Poetry", items: poetry },
];

const Words = () => {
  const libraryDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(books[0]!);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const url = `/assets/pdf/${encodeURIComponent(selected.pdf)}.pdf`;
  const chooseBook = (book: (typeof books)[number]) => {
    if (book.pdf !== selected.pdf) {
      setSelected(book);
      setCurrentPage(1);
      setNumPages(0);
    }
    libraryDialog.current?.close();
  };
  return (
    <Main
      meta={<Meta title="Words — Vid" description="Prose and poetry by Vid." />}
    >
      <div className={styles.library}>
        <button
          className={styles.mobileLibrary}
          aria-label={`Choose a book. Current: ${selected.title}`}
          aria-haspopup="dialog"
          aria-controls="book-library"
          data-cursor="words"
          onClick={() => {
            libraryDialog.current?.showModal();
            libraryDialog.current
              ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
              ?.focus();
          }}
        >
          <LinkIcon kind="words" />
          <span className={styles.selectedTitle}>{selected.title}</span>
          <span className={styles.browseLabel}>
            Library <span aria-hidden="true">⌄</span>
          </span>
        </button>
        <aside className={styles.shelves} aria-label="Library">
          {shelves.map((shelf) => (
            <div key={shelf.title}>
              <h2>{shelf.title}</h2>
              {shelf.items.map((book) => (
                <button
                  key={book.pdf}
                  className={styles.book}
                  data-cursor="words"
                  aria-pressed={selected.pdf === book.pdf}
                  onClick={() => chooseBook(book)}
                >
                  <span>{book.title}</span>
                  <small>{book.subtitle}</small>
                </button>
              ))}
            </div>
          ))}
        </aside>
        <section
          className={styles.reading}
          aria-label={`Reading ${selected.title}`}
        >
          <Reader
            key={selected.pdf}
            url={url}
            currentPage={currentPage}
            handleNextPage={() =>
              setCurrentPage((page) => Math.min(page + 1, numPages))
            }
            handlePrevPage={() =>
              setCurrentPage((page) => Math.max(page - 1, 1))
            }
            numPagez={numPages}
            setNumPagez={setNumPages}
          />
        </section>
      </div>
      <dialog
        id="book-library"
        ref={libraryDialog}
        className={styles.libraryDialog}
        aria-labelledby="library-title"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            libraryDialog.current?.close();
        }}
      >
        <div className={styles.pickerHeader}>
          <h2 id="library-title">Library</h2>
          <button
            onClick={() => libraryDialog.current?.close()}
            aria-label="Close library"
            className={styles.closeLibrary}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className={styles.pickerGroups}>
          {shelves.map((shelf) => (
            <section key={shelf.title} aria-label={shelf.title}>
              <h3>{shelf.title}</h3>
              {shelf.items.map((book) => (
                <button
                  key={book.pdf}
                  className={styles.pickerBook}
                  aria-pressed={selected.pdf === book.pdf}
                  data-cursor="words"
                  onClick={() => chooseBook(book)}
                >
                  <span>
                    <span>{book.title}</span>
                    <small>{book.subtitle}</small>
                  </span>
                  {selected.pdf === book.pdf && (
                    <span aria-hidden="true">✓</span>
                  )}
                </button>
              ))}
            </section>
          ))}
        </div>
      </dialog>
    </Main>
  );
};
export default Words;
