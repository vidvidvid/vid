import { Code as CodeComponent, Flex, Link, VStack } from '@chakra-ui/react';

import { GithubIcon } from '@/components/icons/GithubIcon';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <VStack textColor="white">
      <Flex gap={2}>
        <Link href="https://questchains.xyz/" isExternal>
          Quest Chains
        </Link>
        <Link href="https://github.com/quest-chains/" isExternal>
          <GithubIcon />
        </Link>
      </Flex>
      <CodeComponent>
        a protocol, an SDK, and a platform that allows users to create and
        complete quests.
      </CodeComponent>
      <Flex gap={2}>
        <Link href="https://metagame.wtf/" isExternal>
          MetaGame
        </Link>
        <Link href="https://github.com/MetaFam/" isExternal>
          <GithubIcon />
        </Link>
      </Flex>
      <CodeComponent>massive online coordination game.</CodeComponent>
      <Flex gap={2}>
        <Link href="https://smart-reader-vidvidvid.vercel.app/" isExternal>
          Smart Reader
        </Link>
        <Link href="https://github.com/vidvidvid/smart-reader/" isExternal>
          <GithubIcon />
        </Link>
      </Flex>
      <CodeComponent>sandbox for leveling up on smart contracts.</CodeComponent>
      <Flex gap={2}>
        <Link href="https://rite-of-moloch-v1.vercel.app/" isExternal>
          Rite of Moloch
        </Link>
        <Link href="https://github.com/rite-of-moloch" isExternal>
          <GithubIcon />
        </Link>
      </Flex>
      <CodeComponent>
        dApp to help offset the costly onboarding process and reduce turnover
      </CodeComponent>
      <Flex gap={2}>
        <Link href="https://brglez.herokuapp.com/" isExternal>
          Jure Brglez
        </Link>
        <Link href="https://github.com/vidvidvid/brglez" isExternal>
          <GithubIcon />
        </Link>
      </Flex>
      <CodeComponent>interview with the artist.</CodeComponent>
      <Flex gap={2}>
        <Link href="https://www.meisternote.com/" isExternal>
          MeisterNote
        </Link>
      </Flex>
      <CodeComponent>an online documentation software.</CodeComponent>
      <Flex gap={2}>
        <Link href="https://www.mindmeister.com/" isExternal>
          MindMeister
        </Link>
      </Flex>
      <CodeComponent>a mindmapping tool.</CodeComponent>
    </VStack>
  </Main>
);

export default Code;
