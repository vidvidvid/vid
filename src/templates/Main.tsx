import { Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <Box>
    {props.meta}

    <Link href="/">Home</Link>
    <Link href="/code">Code</Link>
    <Link href="/music">Music</Link>
    <Link href="/visual">Visual media</Link>

    <Flex w="100%" h="100vh" justifyContent="center" alignItems="center">
      {props.children}
    </Flex>
  </Box>
);

export { Main };
