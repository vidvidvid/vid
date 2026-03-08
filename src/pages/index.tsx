import { Box, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import Crazy, { hoverState } from '@/components/3js/Crazy';
import EpilepsyTrigger from '@/components/EpilepsyTrigger';
import { Footer } from '@/components/Footer';
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

const MenuLink = ({
  href,
  label,
  mode,
  stripColor,
  onClick,
}: {
  href?: string;
  label: string;
  mode: string;
  stripColor: string;
  onClick?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
    else if (href) window.location.href = href;
  };

  return (
    <Box
      position="relative"
      cursor="pointer"
      onClick={handleClick}
      onMouseEnter={() => {
        hoverState.mode = mode;
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoverState.mode = null;
        setHovered(false);
      }}
    >
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left="50%"
        width="100vw"
        bg={hovered ? 'var(--strip-bg, #333)' : stripColor}
        opacity={0.85}
        zIndex={-1}
        transform="translateX(-50%)"
        cursor="pointer"
      />
      <Box
        p={1}
        style={{
          color: hovered ? 'var(--label-color, white)' : 'black',
          textDecoration: 'none',
        }}
      >
        {label}
      </Box>
    </Box>
  );
};

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
        <MenuLink
          href="/code"
          label="Code"
          mode="code"
          stripColor={colors.code}
        />
        <MenuLink
          href="/music"
          label="Music"
          mode="music"
          stripColor={colors.music}
        />
        <EpilepsyTrigger
          title="Imagery"
          location="imagery"
          stripColor={colors.imagery}
        />
        <MenuLink
          href="/words"
          label="Words"
          mode="words"
          stripColor={colors.words}
        />
      </VStack>

      <Footer />
    </Main>
  );
};

export default Index;
