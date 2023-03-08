import { Flex, Text } from '@chakra-ui/react';

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
      <Text fontSize={69} color="pink.200">
        MALA ROZA MUCA - MAGMA PUDING
      </Text>
      <Text fontSize={30} color="pink.200">
        20. 3. 2023
      </Text>
    </Flex>
  </Main>
);

export default Music;
