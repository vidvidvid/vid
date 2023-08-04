import { ExternalLinkIcon } from '@chakra-ui/icons'; // Import the ExternalLinkIcon
import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';

import Crazy from '@/components/3js/Crazy';
import CountdownTimer from '@/components/CountdownTimer';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Music = () => (
  <Main meta={<Meta title="Music" description="My music" />}>
    <Crazy />
    <Flex
      direction="column"
      align="center"
      justify="center"
      position="absolute"
      backdropFilter={'blur(5px)'}
      borderRadius="md"
      p={5}
      h="full"
      w="full"
    >
      {/* Add the ExternalLinkIcon next to each link */}
      <Flex
        gap={6}
        mb={6}
        direction={{
          base: 'column',
          md: 'row',
        }}
      >
        <Link
          href="https://soundcloud.com/malarozamuca/sets/magma-puding-1"
          isExternal
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            _hover={{
              transform: 'scale(1.1)',
              transition: 'all 0.2s',
            }}
          >
            <Image
              src="/assets/music/soundcloud.svg"
              w={20}
              h={20}
              mr={3}
              alt="library"
              filter="invert()"
            />
            <ExternalLinkIcon color="pink.200" /> {/* ExternalLinkIcon */}
          </Flex>
        </Link>
        <Link
          href="https://malarozamuca.bandcamp.com/"
          isExternal
          alignSelf="center"
        >
          <Flex
            alignItems="center"
            _hover={{
              transform: 'scale(1.1)',
              transition: 'all 0.2s',
            }}
          >
            <Image
              src="/assets/music/bandcamp.svg"
              w={40}
              mr={3}
              alt="library"
              filter="invert()"
            />
            <ExternalLinkIcon color="pink.200" /> {/* ExternalLinkIcon */}
          </Flex>
        </Link>
      </Flex>
      <Flex
        w={{
          base: '100%',
          md: '50%',
        }}
        mb={8}
        justifyContent="center"
      >
        <Box>
          <iframe
            style={{
              borderRadius: '12px',
            }}
            src="https://open.spotify.com/embed/album/6YKuxDZZZY6IsSIblhvN0j?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </Box>
      </Flex>
      <Link
        href="https://soundcloud.com/malarozamuca/sets/magma-puding-1"
        isExternal
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
      </Link>
      <Text
        fontSize={{
          base: 'xl',
          md: 30,
        }}
        color="pink.200"
      >
        <CountdownTimer date={new Date('August 10, 2023 00:00:00')} />
      </Text>
    </Flex>
  </Main>
);

export default Music;
