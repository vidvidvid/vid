import { Code, Dialog, Flex, Grid, Image, Portal } from '@chakra-ui/react';
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
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const breakpoint =
    typeof window !== 'undefined' && window.innerWidth < 480 ? 'base' : 'sm';

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
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

  const opts =
    breakpoint === 'base' ? { width: '100%', height: 'auto' } : undefined;

  return (
    <Flex flexWrap="wrap" justifyContent="center" h="100vh" mt={32}>
      <Flex
        justifyContent="space-between"
        mb={2}
        className="frame"
        id="videos"
        gap={3}
        direction={{
          base: 'column',
          sm: 'row',
        }}
        w="100vw"
      >
        <YouTube videoId="UdimcciEJh8" opts={opts} />
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
        <YouTube videoId="kPnHaL9bhGk" opts={opts} />
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
      <Dialog.Root open={open} onOpenChange={(details: { open: boolean }) => setOpen(details.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="70%">
              <Dialog.CloseTrigger background="gray.400" />
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
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};

export default Gallery;
