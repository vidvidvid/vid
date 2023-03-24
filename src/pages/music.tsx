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
      <Link href="https://soundcloud.com/malarozamuca/" isExternal>
        <Text fontSize={69} color="pink.200" textAlign="center">
          MALA ROZA MUCA - MAGMA PUDING
        </Text>
      </Link>
      <Text fontSize={30} color="pink.200">
        <CountdownTimer date={new Date('June 21, 2023 00:00:00')} />
      </Text>
    </Flex>
  </Main>
);

export default Music;
