import { Flex, Text } from '@chakra-ui/react';

import CountdownTimer from '@/components/CountdownTimer';
import CrazyComponent from '@/components/CrazyComponent';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Music = () => (
  <Main meta={<Meta title="Music" description="My music" />}>
    <CrazyComponent />
    <Flex
      direction="column"
      align="center"
      justify="center"
      position="absolute"
      backdropFilter={'blur(5px)'}
      borderRadius="md"
      p={5}
    >
      <Text fontSize={69} color="pink.200" textAlign="center">
        MALA ROZA MUCA - MAGMA PUDING
      </Text>
      <Text fontSize={30} color="pink.200">
        <CountdownTimer date={new Date('March 20, 2023 00:00:00')} />
      </Text>
    </Flex>
  </Main>
);

export default Music;
