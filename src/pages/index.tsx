import { VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import Crazy from '@/components/3js/Crazy';
import EpilepsyTrigger from '@/components/EpilepsyTrigger';
import { Footer } from '@/components/Footer';
import StripButton from '@/components/StripButton';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const BRIGHT_COLORS = [
  '#FF3366',
  '#FF6633',
  '#FFCC00',
  '#33FF66',
  '#00CCFF',
  '#6633FF',
  '#FF33CC',
  '#33FFCC',
  '#FF9900',
  '#00FF99',
];

const pickColor = () =>
  BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)]!;

const Index = () => {
  const colors = useMemo(
    () => ({
      code: pickColor(),
      music: pickColor(),
      imagery: pickColor(),
      words: pickColor(),
    }),
    []
  );

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

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Chakra VStack union type complexity */}
      <VStack fontSize={30} zIndex={1001} px={6} spacing={8}>
        <StripButton
          label="Code"
          mode="code"
          stripColor={colors.code}
          onClick={() => {
            window.location.href = '/code';
          }}
        />
        <StripButton
          label="Music"
          mode="music"
          stripColor={colors.music}
          onClick={() => {
            window.location.href = '/music';
          }}
        />
        <EpilepsyTrigger
          title="Imagery"
          location="imagery"
          stripColor={colors.imagery}
        />
        <StripButton
          label="Words"
          mode="words"
          stripColor={colors.words}
          onClick={() => {
            window.location.href = '/words';
          }}
        />
      </VStack>

      <Footer />
    </Main>
  );
};

export default Index;
