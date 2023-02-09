import { Flex } from '@chakra-ui/react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Vid's personal website"
          description="Clusterfuck of everything I'm doing with my life."
        />
      }
    >
      <Flex w="100%" h="100vh" justifyContent="center" alignItems="center">
        CUMMING SOON
      </Flex>
    </Main>
  );
};

export default Index;
