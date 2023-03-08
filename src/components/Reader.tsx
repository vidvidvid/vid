import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
          <ArrowBackIcon />
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
          <ArrowForwardIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default Reader;
