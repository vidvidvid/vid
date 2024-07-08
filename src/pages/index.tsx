import { Link, VStack } from '@chakra-ui/react';

import Crazy from '@/components/3js/Crazy';
import EpilepsyTrigger from '@/components/EpilepsyTrigger';
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
      <Crazy />

      <VStack fontSize={30} zIndex={1001}>
        <Link
          href="/code"
          className="hover-effect-1"
          p={3}
          borderRadius={10}
          color="black"
          style={{
            textDecoration: 'none',
          }}
        >
          Code
        </Link>

        <Link
          href="/music"
          className="hover-effect-4"
          p={3}
          borderRadius={10}
          color="black"
          style={{
            textDecoration: 'none',
          }}
        >
          Music
        </Link>
        <EpilepsyTrigger title="Imagery" location="imagery" hoverEffect={3} />

        <Link href="/words" className="hover-effect-2" p={4} color="black">
          Words
        </Link>
      </VStack>

      <Footer />
    </Main>
  );
};

export default Index;
