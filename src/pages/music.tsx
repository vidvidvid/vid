import {
  Flex,
  Image,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import Crazy from '@/components/3js/Crazy';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Music = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Main meta={<Meta title="Music" description="My music" />}>
      <Crazy />
      <Flex
        direction="column"
        align="center"
        justify="center"
        position="relative" // changed from absolute to allow scroll
        borderRadius="md"
        p={5}
        h="auto" // changed from full to auto to allow content to dictate height
        w="full"
        overflowY="auto" // allow scrolling
      >
        <VStack
          spacing={6}
          paddingX={{
            base: 0,
            md: 20,
          }}
          paddingTop={{
            base: 0,
            md: 20,
          }}
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
          {[
            {
              href: 'https://open.spotify.com/album/70a6gr7P014ZCqcpauUXuc',
              img: '/assets/music/spotify.jpeg',
              text: 'Spotify',
            },
            {
              href: 'https://soundcloud.com/malarozamuca',
              img: '/assets/music/soundcloud.jpg',
              text: 'SoundCloud',
            },
            {
              hre: 'https://malarozamuca.bandcamp.com/album/magma-puding',
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
              width={{
                base: 'full',
                md: '400px',
              }}
            >
              <Flex
                alignItems="center"
                boxShadow="0px 0px 5px #000000"
                width="full"
                p={4}
                borderRadius="md"
                backdropFilter={'blur(5px)'}
                _hover={{ bg: 'gray.600' }}
                direction={{
                  base: 'column',
                  md: 'row',
                }}
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
        </VStack>
      </Flex>
    </Main>
  );
};

export default Music;
