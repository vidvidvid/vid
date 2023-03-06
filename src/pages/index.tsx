import { Link, Text, VStack } from '@chakra-ui/react';

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
          position="relative"
          p={3}
          borderRadius={10}
          role="group"
          style={{
            textDecoration: 'none',
          }}
        >
          <Text>Code</Text>
        </Link>
        <Link
          href="/music"
          className="hover-effect-2"
          position="relative"
          p={4}
        >
          Music
        </Link>
        <Link
          href="/visual"
          className="hover-effect-3"
          position="relative"
          p={4}
        >
          Visual media
        </Link>
      </VStack>
      <Footer />
    </Main>
  );
};

export default Index;
