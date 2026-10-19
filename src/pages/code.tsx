import { motion } from 'motion/react';
import React from 'react';

import CodeCard from '@/components/CodeCard';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './code.module.css';

const projects = [
  {
    name: "MaEarth",
    description: "regenerative platform connecting people with the Earth.",
    image: "maearth.svg",
    websiteLink: "https://maearth.com/",
    current: true,
  },
  {
    name: "zero",
    description:
      "A minimal macOS code editor for running coding agents. Projects, terminals, and git worktrees.",
    image: "zero.png",
    websiteLink: "https://zeroeditor.sh/",
    githubLink: "https://github.com/zero-editor/zero",
    current: true,
  },
  {
    name: "Ecliptica",
    description:
      "AI-powered market research, portfolio controls, and trading infrastructure.",
    image: "ecliptica.svg",
    websiteLink: "https://www.ecliptica.ai/",
    current: true,
  },
  {
    name: "Metamorfoza",
    description:
      "Website and event archive for the Metamorfoza collective in Ljubljana.",
    image: "metamorfoza.svg",
    websiteLink: "https://metamorfoza.art/",
    githubLink: "https://github.com/vidvidvid/metamorfoza",
    current: true,
  },
  {
    name: "doppelgänger",
    description:
      "Reference-matching EQ and dynamics for Ableton Live. Match tracks, groups, and masters.",
    image: "doppelganger.svg",
    websiteLink: "https://download-production-14fa.up.railway.app/",
    githubLink: "https://github.com/vidvidvid/doppelganger",
    current: true,
  },
  {
    name: "floor",
    description:
      "Find rewards in real places. An iPhone app for discovering and collecting nearby drops.",
    image: "floor.png",
    websiteLink: "https://flooronrh.com/",
    appStoreLink:
      "https://apps.apple.com/app/floor-real-world-drops/id6810726093",
    current: true,
  },
  {
    name: "TokiFlow",
    description:
      "team timeline & Gantt chart app with Linear/GitHub integrations.",
    image: "tokiflow.svg",
    websiteLink: "https://www.tokiflow.app/",
    current: true,
  },
  {
    name: "JanitorAI",
    description: "anime-style character chat robot website.",
    image: "janitor.png",
    websiteLink: "https://janitorai.com/",
  },
  {
    name: "HackerTracker",
    description: "hackathon aggregator with AI-powered opportunity scoring.",
    websiteLink: "https://hackertracker-production.up.railway.app/",
    hobby: true,
  },
  {
    name: "Nerite",
    description:
      "decentralized borrowing protocol with the first natively streamable stablecoin.",
    image: "nerite.svg",
    websiteLink: "https://www.nerite.org/",
    githubLink: "https://github.com/NeriteOrg/nerite",
  },
  {
    name: "Liquity",
    description: "governance-free borrowing protocol on Ethereum.",
    image: "liquity.jpeg",
    websiteLink: "https://www.liquity.org/",
    githubLink: "https://github.com/liquity",
  },
  {
    name: "Optimism Retro Funding",
    description: "frontend lead for retroactive public goods funding rounds.",
    image: "optimism.svg",
    websiteLink: "https://round5.optimism.io/",
  },
  {
    name: "Hats Protocol",
    description: "DAO-native way to structure organizations.",
    image: "hat.svg",
    websiteLink: "https://www.hatsprotocol.xyz/",
    githubLink: "https://github.com/Hats-Protocol/hats-protocol",
  },
  {
    name: "Quest Chains",
    description:
      "a protocol, an SDK, and a platform that allows users to create and complete quests.",
    image: "questchains.png",
    githubLink: "https://github.com/quest-chains/",
    websiteLink: "https://questchains.xyz/",
  },
  {
    name: "MetaGame",
    description: "massive online coordination game.",
    image: "metagame.webp",
    githubLink: "https://github.com/MetaFam/",
    websiteLink: "https://metagame.wtf/",
  },
  {
    name: "Smart Reader",
    description: "sandbox for leveling up on smart contracts.",
    image: "smartreader.png",
    githubLink: "https://github.com/vidvidvid/smart-reader/",
    websiteLink: "https://smart-reader-vidvidvid.vercel.app/",
  },
  {
    name: "Rite of Moloch",
    description:
      "dApp to help offset the costly onboarding process and reduce turnover",
    image: "rite.webp",
    githubLink: "https://github.com/rite-of-moloch",
    websiteLink: "https://rite-of-moloch-v1.vercel.app/",
  },
  {
    name: "MeisterNote",
    description: "an online documentation software.",
    image: "meisternote.svg",
    websiteLink: "https://www.meisternote.com/",
  },
  {
    name: "MindMeister",
    description: "a mindmapping tool.",
    image: "mindmeister.png",
    websiteLink: "https://www.mindmeister.com/",
  },
];

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        >
          <CodeCard
            image={project.image}
            name={project.name}
            description={project.description}
            githubLink={project.githubLink}
            websiteLink={project.websiteLink}
            appStoreLink={project.appStoreLink}
            current={project.current}
            hobby={project.hobby}
          />
        </motion.div>
      ))}
    </div>
  </Main>
);

export default Code;
