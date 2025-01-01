import {
  AspectRatio,
  Box,
  Flex,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Music = () => {
  const isMobile: boolean = useBreakpointValue({
    base: true,
    md: false,
  }) as boolean;

  return (
    <Main meta={<Meta title="Music" description="My music" />}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage={'url(/assets/music/background.gif)'}
        backgroundSize="cover"
        backgroundPosition="center"
        overflowY="auto"
        pb={10}
      >
        <VStack
          spacing={6}
          paddingX={{
            base: 0,
            md: 20,
          }}
          py={{
            base: 10,
            md: 20,
          }}
          h="full"
          width="full"
        >
          {!isMobile && (
            <Link
              href="https://soundcloud.com/malarozamuca/sets/magma-puding-1"
              isExternal
            >
              <Flex
                alignItems="center"
                boxShadow="0px 0px 5px #000000"
                width="full"
                p={4}
                borderRadius="md"
                backdropFilter={'blur(5px)'}
                _hover={{ bg: 'gray.600' }}
                justify="center"
              >
                <Text
                  fontSize={{
                    base: 30,
                    md: 69,
                  }}
                  color="pink.200"
                  textAlign="center"
                >
                  🍮 MAGMA PUDING 🫠
                </Text>
              </Flex>
            </Link>
          )}

          <Box width="full">
            <SimpleGrid columns={isMobile ? 1 : 2} spacing={4} mb={8}>
              {[
                'https://www.youtube.com/embed/hL1JlhjoAGE',
                'https://www.youtube.com/embed/WNGHfBkfdPw',
                'https://www.youtube.com/embed/BCIssMctm7s',
                'https://www.youtube.com/embed/nAAXQ7M-5L8',
              ].map((videoSrc) => (
                <AspectRatio ratio={16 / 9} key={videoSrc}>
                  <iframe
                    src={videoSrc}
                    allowFullScreen
                    title="YouTube Video"
                  />
                </AspectRatio>
              ))}
            </SimpleGrid>
          </Box>

          <SimpleGrid
            columns={isMobile ? 1 : 2}
            spacing={8}
            width="full"
            pb={20}
          >
            <Stack>
              {[
                {
                  href: 'https://open.spotify.com/artist/7FuUBYVB5laxuMXLDAeIGz',
                  img: '/assets/music/spotify.jpeg',
                  text: 'Spotify',
                },
                {
                  href: 'https://soundcloud.com/malarozamuca',
                  img: '/assets/music/soundcloud.jpg',
                  text: 'SoundCloud',
                },
                {
                  href: 'https://malarozamuca.bandcamp.com/album/magma-puding',
                  img: '/assets/music/bandcamp.jpg',
                  text: 'Bandcamp',
                },
                {
                  href: 'https://music.apple.com/us/album/magma-puding/1701729762',
                  img: '/assets/music/applemusic.jpg',
                  text: 'Apple Music',
                },
                {
                  href: 'https://www.youtube.com/channel/UCoO_Ijq0rZJwetO8a8orQJQ',
                  img: '/assets/music/youtube.jpg',
                  text: 'YouTube',
                },
              ].map((linkData) => (
                <Link
                  href={linkData.href}
                  isExternal
                  key={linkData.href}
                  width="full"
                >
                  <Flex
                    alignItems="center"
                    boxShadow="0px 0px 5px #000000"
                    width="full"
                    p={4}
                    borderRadius="md"
                    backdropFilter={'blur(5px)'}
                    _hover={{ bg: 'gray.600' }}
                    direction="row"
                    justify="space-between"
                  >
                    <Image
                      src={linkData.img}
                      boxSize={50}
                      alt={linkData.text}
                      mr={4}
                    />
                    <Text>{linkData.text}</Text>
                  </Flex>
                </Link>
              ))}
            </Stack>

            <Stack>
              {[
                {
                  href: 'https://radiostudent.si/glasba/tolpa-bumov/mala-roza-muca-magma-puding',
                  text: 'Review of Magma Puding by Marko Miočić',
                },
                {
                  href: 'https://www.sigic.si/dr-corecore-filozofije-mala-roza-muca.html',
                  text: 'Review of mala roza muca by Špela Cvetko',
                },
              ].map((linkData) => (
                <Link
                  href={linkData.href}
                  isExternal
                  key={linkData.href}
                  width="full"
                >
                  <Flex
                    alignItems="center"
                    boxShadow="0px 0px 5px #000000"
                    width="full"
                    p={4}
                    borderRadius="md"
                    backdropFilter={'blur(5px)'}
                    _hover={{ bg: 'gray.600' }}
                    justify="space-between"
                  >
                    <Text>{linkData.text}</Text>
                  </Flex>
                </Link>
              ))}
            </Stack>
          </SimpleGrid>
        </VStack>
      </Flex>
    </Main>
  );
};

export default Music;
