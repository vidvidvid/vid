import { Grid } from '@chakra-ui/react';
import React from 'react';

import CodeCard from '@/components/CodeCard';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const projects = [
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

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={6}
      // mt={200}
      h="100vh"
      py={20}
      mb={10}
    >
      {projects.map((project, index) => (
        <CodeCard
          key={index}
          image={project.image}
          name={project.name}
          description={project.description}
          githubLink={project.githubLink}
          websiteLink={project.websiteLink}
        />
      ))}
    </Grid>
  </Main>
);

export default Code;
