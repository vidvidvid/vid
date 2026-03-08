import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Box, Button, Flex } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';

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
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Flex w="full" h="full" alignItems="center">
        <Button
          variant="ghost"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          mr={3}
        >
          &#8592;
        </Button>
        <Document file={url} onLoadSuccess={handleDocumentLoadSuccess}>
          <Page pageNumber={currentPage} />
        </Document>
        <Button
          variant="ghost"
          disabled={currentPage === numPagez}
          onClick={handleNextPage}
          ml={3}
        >
          &#8594;
        </Button>
      </Flex>
    </Box>
  );
};

export default Reader;
