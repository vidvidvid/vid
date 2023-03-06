import { Code as CodeComponent, Link, VStack } from '@chakra-ui/react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <VStack textColor="white">
      <Link href="https://questchains.xyz/">Quest Chains</Link>{' '}
      <CodeComponent>
        a protocol, an SDK, and a platform that allows users to create and
        complete quests.
      </CodeComponent>
      <Link href="https://metagame.wtf/">MetaGame</Link>
      <CodeComponent>massive online coordination game.</CodeComponent>
      <Link href="https://smart-reader-vidvidvid.vercel.app/">
        Smart Reader
      </Link>{' '}
      <CodeComponent>sandbox for leveling up on smart contracts.</CodeComponent>
      <Link href="https://www.meisternote.com/">MeisterNote</Link>
      <CodeComponent>an online documentation software.</CodeComponent>
      <Link href="https://www.mindmeister.com/">MindMeister</Link>{' '}
      <CodeComponent>a mindmapping tool.</CodeComponent>
    </VStack>
  </Main>
);

export default Code;
