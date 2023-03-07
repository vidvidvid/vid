import { Link, VStack } from '@chakra-ui/react';

import { Footer } from '@/components/Footer';
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
        <Link
          href="/code"
          className="hover-effect-1"
          p={3}
          borderRadius={10}
          style={{
            textDecoration: 'none',
          }}
        >
          Code
        </Link>
        <Link href="/music" className="hover-effect-2" p={4}>
          Music
        </Link>
        <Link href="/imagery" className="hover-effect-3" p={4}>
          Imagery
        </Link>
        <Link href="/words" className="hover-effect-4" p={4}>
          Words
        </Link>
      </VStack>
      <Footer />
    </Main>
  );
};

export default Index;
