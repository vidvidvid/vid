import {
  Box,
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

type GalleryProps = {
  images: string[];
};

const Gallery = ({ images }: GalleryProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  return (
    <Flex flexWrap="wrap" justifyContent="center" h="100vh" mt={20}>
      {images.map((image, index) => (
        <Box
          key={index}
          w={{ base: '100%', sm: '50%', md: '33%', lg: '25%' }}
          p={2}
          onClick={() => handleImageClick(image)}
          cursor="pointer"
        >
          <Image
            alt="image"
            src={image}
            w="100%"
            h="auto"
            objectFit="cover"
            borderRadius="md"
            transition="0.3s"
            _hover={{ transform: 'scale(1.05)' }}
          />
        </Box>
      ))}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="70%">
          <ModalCloseButton />
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
