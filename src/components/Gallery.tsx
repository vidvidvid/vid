import {
  Flex,
  Grid,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

import Card from './Card';

type GalleryProps = {
  images: {
    image: string;
    description: string;
  }[];
};

const Gallery = ({ images }: GalleryProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  return (
    <Flex flexWrap="wrap" justifyContent="center" h="100vh" mt={32}>
      {/* chakra Grid with 4 columns in a row */}
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={2}
        // set min height of each of grid elements to 300px
        // so that the grid doesn't collapse when there are less than 4 images
        minH="300px"
        w="100vw"
        position="relative"
      >
        {images.map(({ image, description }, index) => (
          <Card
            key={index}
            bgImage={image}
            front={
              <Image
                alignSelf="center"
                alt="image"
                onClick={() => handleImageClick(image)}
                src={image}
                w="100%"
                h="auto"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
              />
            }
            back={
              <Text
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
                color="black"
              >
                {description}
              </Text>
            }
          />
        ))}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="70%">
          <ModalCloseButton background="gray.400" />
          {selectedImage && (
            <Image
              alt="image"
              src={selectedImage}
              w="100%"
              h="auto"
              objectFit="cover"
              borderRadius="md"
            />
          )}
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Gallery;
