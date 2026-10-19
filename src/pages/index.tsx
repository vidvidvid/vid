import { useMemo } from 'react';

import Crazy from '@/components/3js/Crazy';
import EpilepsyTrigger from '@/components/EpilepsyTrigger';
import { Footer } from '@/components/Footer';
import StripButton from '@/components/StripButton';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './index.module.css';

const BRIGHT_COLORS = [
  '#FF3366', '#FF6633', '#FFCC00', '#33FF66', '#00CCFF',
  '#6633FF', '#FF33CC', '#33FFCC', '#FF9900', '#00FF99',
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

      <div className={styles.nav}>
        <StripButton
          label="Code"
          mode="code"
          stripColor={colors.code}
          onClick={() => { window.location.href = '/code'; }}
        />
        <StripButton
          label="Music"
          mode="music"
          stripColor={colors.music}
          onClick={() => { window.location.href = '/music'; }}
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
          onClick={() => { window.location.href = '/words'; }}
        />
      </div>

      <Footer />
    </Main>
  );
};

export default Index;
