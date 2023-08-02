import { Flex, Link, Text } from '@chakra-ui/react';

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
    >
      <Flex
        w={{
          base: '100%',
          md: '50%',
        }}
      >
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
      </Flex>
      <Link href="https://soundcloud.com/malarozamuca/" isExternal>
        <Text fontSize={69} color="pink.200" textAlign="center">
          MALA ROZA MUCA - MAGMA PUDING
        </Text>
      </Link>
      <Text fontSize={30} color="pink.200">
        <CountdownTimer date={new Date('August 10, 2023 00:00:00')} />
      </Text>
    </Flex>
  </Main>
);

export default Music;
