import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

import Reader from '@/components/Reader';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Words = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const books = [
    {
      title: 'Starec',
      pdf: 'Starec',
      subtitle: '2020',
    },
    {
      title: 'Sveta Knjiga',
      subtitle: 'Lepe Marke, Kakadu & Moja soba',
      pdf: 'svetaknjiga',
    },
    {
      title: 'Jajce',
      subtitle: '2015, unfinished',
      pdf: 'jajce',
    },
    {
      title: 'Zgodbice za odrasle',
      subtitle: '2016',
      pdf: 'zgodbicezaodrasle',
    },
    {
      title: 'Dolga, dolga je pot do zvezd',
      subtitle: '2021, unfinished',
      pdf: 'dolga',
    },
    {
      title: 'Grde Papilone',
      subtitle: '2022',
      pdf: 'grdepapilone',
    },
    {
      title: 'Nekoc Surina',
      subtitle: '2018, unfinished',
      pdf: 'NekocSurina',
    },
    {
      title: 'Sem Iskal',
      subtitle: '2012',
      pdf: 'Sem iskal',
    },
    {
      title: 'V bistvu sem budist',
      subtitle: '2021',
      pdf: 'vbistvu',
    },
  ];

  const poetry = [
    {
      title: 'Predvčerajšnjim',
      pdf: 'predvcerajsnjim',
      subtitle: ' - 2013',
    },
    {
      title: 'Včeraj',
      pdf: 'vceraj',
      subtitle: '2013 - 2016',
    },
    {
      title: 'Pojutrišnjem',
      pdf: 'pojutrisnjem',
      subtitle: '2016 - 2019',
    },
    {
      title: 'Popojutrišnjem',
      pdf: 'popojutrisnjem',
      subtitle: '2019 - ',
    },
  ];

  const [bookIndex, setBookIndex] = useState<number>(0);
  const [poetryIndex, setPoetryIndex] = useState<number>(0);

  const [isViewingPoetry, setIsViewingPoetry] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePrevPage = () => {
    setCurrentPage((currPage) => Math.max(currPage - 1, 1));
  };

  const [numPagez, setNumPagez] = useState<number>(0);
  const handleNextPage = () => {
    setCurrentPage((currPage) => Math.min(currPage + 1, numPagez));
  };

  const breakpoint = useBreakpoint();

  return (
    <Main meta={<Meta title="Words" description="My words" />}>
      <Button
        onClick={onOpen}
        position="absolute"
        left={5}
        top={14}
        variant="ghost"
      >
        <Image
          src="/assets/images/book.png"
          w={8}
          h={8}
          mr={3}
          alt="library"
          filter="invert()"
        />
        Library
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Library</DrawerHeader>

          <DrawerBody>
            <Text mb={3} textAlign="right">
              Prose
            </Text>
            <Flex direction="column" gap={2}>
              {books.map(({ title, subtitle }, index) => (
                <Flex
                  key={title}
                  onClick={() => {
                    setBookIndex(index);
                    setIsViewingPoetry(false);
                    onClose();
                    setCurrentPage(1);
                  }}
                  alignItems="baseline"
                  cursor="pointer"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  justifyContent="space-between"
                  w="full"
                >
                  <Text>{title}</Text>
                  {subtitle && (
                    <Text
                      as="span"
                      fontSize="xs"
                      ml={2}
                      color="gray.400"
                      textAlign="right"
                    >
                      ({subtitle})
                    </Text>
                  )}
                </Flex>
              ))}
            </Flex>
            <Text mb={3} mt={8} textAlign="right">
              Poetry
            </Text>
            <Flex direction="column" gap={2}>
              {poetry.map(({ title, subtitle }, index) => (
                <Flex
                  key={title}
                  onClick={() => {
                    setPoetryIndex(index);
                    setIsViewingPoetry(true);
                    onClose();
                    setCurrentPage(1);
                  }}
                  alignItems="baseline"
                  cursor="pointer"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  justifyContent="space-between"
                  w="full"
                >
                  {title}
                  {subtitle && (
                    <Text as="span" fontSize="xs" ml={2} color="gray.400">
                      ({subtitle})
                    </Text>
                  )}
                </Flex>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {breakpoint === 'base' ? (
        <Box p={10}>
          <Text>Not available on mobile. Please view on desktop.</Text>
        </Box>
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
