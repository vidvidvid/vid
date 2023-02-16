import { VStack } from '@chakra-ui/react';
import Link from 'next/link';

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
      <VStack fontSize={30}>
        <Link href="/code" className="hover-effect-1">
          Code
        </Link>
        <Link href="/music" className="hover-effect-2">
          Music
        </Link>
        <Link href="/visual" className="hover-effect-3">
          Visual media
        </Link>
      </VStack>
    </Main>
  );
};

export default Index;
