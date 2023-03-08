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
    >
      <Text fontSize={69} color="pink.200">
        MALA ROZA MUCA - MAGMA PUDING
      </Text>
      <Text fontSize={30} color="pink.400">
        coming soon
      </Text>
    </Flex>
  </Main>
);

export default Music;
