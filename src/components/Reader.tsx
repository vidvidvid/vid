import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';

import styles from './Reader.module.css';

interface ReaderProps {
  url: string;
  currentPage: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  numPagez: number;
  setNumPagez: (num: number) => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Reader: React.FC<ReaderProps> = ({
  url,
  currentPage,
  handleNextPage,
  handlePrevPage,
  numPagez,
  setNumPagez,
}) => {
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPagez(numPages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          &#8592;
        </button>
        <Document file={url} onLoadSuccess={handleDocumentLoadSuccess}>
          <Page pageNumber={currentPage} />
        </Document>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          disabled={currentPage === numPagez}
          onClick={handleNextPage}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Reader;
