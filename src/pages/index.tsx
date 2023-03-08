import { Link, VStack } from '@chakra-ui/react';

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
        <EpilepsyTrigger title="Music" location="music" hoverEffect={4} />

        <EpilepsyTrigger title="Imagery" location="imagery" hoverEffect={3} />
        <Link href="/words" className="hover-effect-2" p={4}>
          Words
        </Link>
      </VStack>

      <Footer />
    </Main>
  );
};

export default Index;
