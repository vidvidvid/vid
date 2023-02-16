import { Image, VStack } from '@chakra-ui/react';
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
      <VStack>
        <Image src="/logo.png" alt="Coming soon" w={200} />
        <Link href="/code">Code</Link>
        <Link href="/music">Music</Link>
        <Link href="/visual">Visual media</Link>
      </VStack>
    </Main>
  );
};

export default Index;
