import {
  Code,
  Flex,
  Grid,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

import Card from './Card';

type GalleryProps = {
  imagery: {
    image?: string;
    youtubeId?: string;
    description: string;
  }[];
};

const Gallery = ({ imagery }: GalleryProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  useEffect(() => {
    const colors = [
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
    ];

    const el = document.querySelector('#videos') as HTMLElement;
    el.style.setProperty('--color-1', colors[0] || 'red');
    el.style.setProperty('--color-2', colors[1] || 'blue');
    el.style.setProperty('--color-3', colors[2] || 'green');
    el.style.setProperty('--color-4', colors[3] || 'yellow');
    el.style.setProperty('--color-5', colors[4] || 'purple');
  }, []);

  return (
    <Flex flexWrap="wrap" justifyContent="center" h="100vh" mt={32}>
      {/* chakra Grid with 4 columns in a row */}
      <Flex
        justifyContent="space-between"
        w="full"
        mb={2}
        className="frame"
        id="videos"
        gap={3}
      >
        <YouTube videoId="UdimcciEJh8" />
        <Flex gap={3}>
          <Code p={2} color="black" h="min-content">
            &#8592; When I was listening to this song in high school I realised
            these lyrics need to be visualised, so I did.
          </Code>
          <Code p={2} color="black" h="min-content">
            My first frame-by-frame animation. Guy farts himself to death.
            &#8594;
          </Code>
        </Flex>
        <YouTube videoId="Czq4VWOO4bM" />
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={2}
        minH="300px"
        w="100vw"
        position="relative"
      >
        {imagery.map(({ image, description }, index) => (
          <Card
            key={index}
            element={
              <Image
                alignSelf="center"
                alt="image"
                onClick={() => {
                  if (image) handleImageClick(image);
                }}
                src={image}
                w="100%"
                h="auto"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
              />
            }
            index={index}
            description={description}
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
