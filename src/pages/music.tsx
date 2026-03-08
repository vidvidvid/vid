import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Music = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <Main meta={<Meta title="Music" description="My music" />}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
          px={{ base: 0, md: 20 }}
          py={{ base: 10, md: 20 }}
          h="full"
          width="full"
        >
          {!isMobile && (
            <Box display="flex" flexDirection="column" gap={4} width="full">
              <Link
                href="https://soundcloud.com/malarozamuca/sets/lambda-male"
                target="_blank"
                rel="noopener noreferrer"
                width="full"
              >
                <Flex
                  alignItems="center"
                  boxShadow="0px 0px 8px #000000"
                  width="full"
                  p={6}
                  borderRadius="md"
                  backdropFilter={'blur(8px)'}
                  bg="blackAlpha.400"
                  _hover={{ bg: 'gray.600' }}
                  justify="center"
                  border="1px solid"
                  borderColor="pink.300"
                >
                  <Text
                    fontSize={{
                      base: 36,
                      md: 80,
                    }}
                    color="pink.100"
                    textAlign="center"
                    fontWeight="bold"
                  >
                    Λ♂ LAMBDA MALE
                  </Text>
                </Flex>
              </Link>
              <Link
                href="https://soundcloud.com/malarozamuca/sets/magma-puding-1"
                target="_blank"
                rel="noopener noreferrer"
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
                      base: 24,
                      md: 48,
                    }}
                    color="pink.200"
                    textAlign="center"
                  >
                    🍮 MAGMA PUDING 🫠
                  </Text>
                </Flex>
              </Link>
            </Box>
          )}

          <Box width="full">
            <SimpleGrid columns={isMobile ? 1 : 2} gap={4} mb={8}>
              {[
                'https://www.youtube.com/embed/3_FhRjYvFLo',
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
            gap={8}
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
                  target="_blank"
                  rel="noopener noreferrer"
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
                      boxSize="50px"
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
                  target="_blank"
                  rel="noopener noreferrer"
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

          <Box width="full" pb={20}>
            <Text
              fontSize={{ base: 24, md: 36 }}
              color="pink.200"
              textAlign="center"
              mb={6}
            >
              Releases
            </Text>
            <Box display="flex" flexDirection="column" gap={3} width="full">
              {[
                {
                  title: 'Λ♂ (Lambda Male)',
                  type: 'EP',
                  year: '2025',
                  href: 'https://soundcloud.com/malarozamuca/sets/lambda-male',
                },
                {
                  title: 'Prijatelj je vreden vec kot jakna',
                  type: 'Single',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca',
                },
                {
                  title: 'Dino (feat. WAKNU)',
                  type: 'EP',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca/sets/dino',
                },
                {
                  title: 'The Balkan Dwarf',
                  type: 'Single',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca/balkan-dwarf',
                },
                {
                  title: 'nyulv<3',
                  type: 'EP (via childsplay)',
                  year: '2023',
                  href: 'https://childrenatplay.bandcamp.com/album/nyulv-3',
                },
                {
                  title: 'Magma Puding',
                  type: 'Album',
                  year: '2023',
                  href: 'https://soundcloud.com/malarozamuca/sets/magma-puding-1',
                },
              ].map((release) => (
                <Link
                  href={release.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={release.title}
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
                    <HStack gap={3}>
                      <Badge
                        colorPalette="pink"
                        fontSize="sm"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {release.year}
                      </Badge>
                      <Text color="white" fontSize={{ base: 'md', md: 'lg' }}>
                        {release.title}
                      </Text>
                    </HStack>
                    <Text color="gray.400" fontSize="sm">
                      {release.type}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Main>
  );
};

export default Music;
