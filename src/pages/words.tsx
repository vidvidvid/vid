import {
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
  ];

  // const poetry = [
  //   {
  //     title: 'Starec',
  //     pdf: 'Starec',
  //     subtitle: '2020',
  //   },
  //   {
  //     title: 'Sveta Knjiga',
  //     subtitle: 'Lepe Marke, Kakadu & Moja soba',
  //     pdf: 'svetaknjiga',
  //   },
  //   {
  //     title: 'Jajce',
  //     subtitle: '2015, unfinished',
  //     pdf: 'jajce',
  //   },
  //   {
  //     title: 'Zgodbice za odrasle',
  //     subtitle: '2016',
  //     pdf: 'zgodbicezaodrasle',
  //   },
  // ];

  const [bookIndex, setBookIndex] = useState<number>(0);

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
                <Text
                  key={title}
                  onClick={() => {
                    setBookIndex(index);
                    onClose();
                  }}
                  cursor="pointer"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  {title}
                  {subtitle && (
                    <Text as="span" fontSize="xs" ml={2} color="gray.400">
                      ({subtitle})
                    </Text>
                  )}
                </Text>
              ))}
            </Flex>
            {/* <Text mb={3} mt={8} textAlign="right">
              Poetry
            </Text>
            <Flex direction="column" gap={2}>
              {poetry.map(({ title, subtitle }, index) => (
                <Text
                  key={title}
                  onClick={() => {
                    setBookIndex(index);
                    onClose();
                  }}
                  cursor="pointer"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  {title}
                  {subtitle && (
                    <Text as="span" fontSize="xs" ml={2} color="gray.400">
                      ({subtitle})
                    </Text>
                  )}
                </Text>
              ))}
            </Flex> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Reader url={`/assets/pdf/${books[bookIndex]?.pdf}.pdf`} />
    </Main>
  );
};

export default Words;
