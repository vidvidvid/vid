import { Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import CodeCard from '@/components/CodeCard';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const projects = [
  {
    name: 'Ecliptica',
    description: 'AI-powered financial intelligence for crypto markets.',
    websiteLink: 'https://www.strata.ecliptica.ai/',
  },
  {
    name: 'Nerite',
    description:
      'decentralized borrowing protocol with the first natively streamable stablecoin.',
    websiteLink: 'https://www.nerite.org/',
    githubLink: 'https://github.com/NeriteOrg/nerite',
  },
  {
    name: 'Liquity',
    description: 'governance-free borrowing protocol on Ethereum.',
    websiteLink: 'https://www.liquity.org/',
    githubLink: 'https://github.com/liquity',
  },
  {
    name: 'Must Finance',
    description:
      'decentralized borrowing against multiple collateral types on Saga.',
    websiteLink: 'https://app.must.finance/',
  },
  {
    name: 'Optimism Retro Funding',
    description: 'frontend lead for retroactive public goods funding rounds.',
    websiteLink: 'https://round5.optimism.io/',
  },
  {
    name: 'TokiFlow',
    description:
      'team timeline & Gantt chart app with Linear/GitHub integrations.',
  },
  {
    name: 'HackerTracker',
    description: 'hackathon aggregator with AI-powered opportunity scoring.',
    websiteLink: 'https://hackertracker-production.up.railway.app/',
  },
  {
    name: 'JanitorAI',
    description: 'anime-style character chat robot website.',
    image: 'janitor.png',
    websiteLink: 'https://janitorai.com/',
  },
  {
    name: 'Hats Protocol',
    description: 'DAO-native way to structure organizations.',
    image: 'hat.svg',
    websiteLink: 'https://www.hatsprotocol.xyz/',
  },
  {
    name: 'Quest Chains',
    description:
      'a protocol, an SDK, and a platform that allows users to create and complete quests.',
    image: 'questchains.png',
    githubLink: 'https://github.com/quest-chains/',
    websiteLink: 'https://questchains.xyz/',
  },
  {
    name: 'MetaGame',
    description: 'massive online coordination game.',
    image: 'metagame.webp',
    githubLink: 'https://github.com/MetaFam/',
    websiteLink: 'https://metagame.wtf/',
  },
  {
    name: 'Smart Reader',
    description: 'sandbox for leveling up on smart contracts.',
    image: 'smartreader.png',
    githubLink: 'https://github.com/vidvidvid/smart-reader/',
    websiteLink: 'https://smart-reader-vidvidvid.vercel.app/',
  },
  {
    name: 'Rite of Moloch',
    description:
      'dApp to help offset the costly onboarding process and reduce turnover',
    image: 'rite.webp',
    githubLink: 'https://github.com/rite-of-moloch',
    websiteLink: 'https://rite-of-moloch-v1.vercel.app/',
  },
  {
    name: 'Jure Brglez',
    description: 'interview with the artist.',
    image: 'brglez.png',
    githubLink: 'https://github.com/vidvidvid/brglez',
    websiteLink: 'https://brglez.herokuapp.com/',
  },
  {
    name: 'MeisterNote',
    description: 'an online documentation software.',
    image: 'meisternote.svg',
    websiteLink: 'https://www.meisternote.com/',
  },
  {
    name: 'MindMeister',
    description: 'a mindmapping tool.',
    image: 'mindmeister.png',
    websiteLink: 'https://www.mindmeister.com/',
  },
];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 400) - 200) / 100; // range -2 to 2
}

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={6}
      py={20}
      mb={10}
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: 'easeOut',
          }}
          style={{
            rotate: `${seededRandom(project.name)}deg`,
          }}
        >
          <CodeCard
            image={project.image}
            name={project.name}
            description={project.description}
            githubLink={project.githubLink}
            websiteLink={project.websiteLink}
          />
        </motion.div>
      ))}
    </Grid>
  </Main>
);

export default Code;
