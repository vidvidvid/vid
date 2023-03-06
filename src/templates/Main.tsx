import { Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();

  const isHome = router.pathname === '/';

  return (
    <Box h="100vh" w="100vw">
      {props.meta}

      {!isHome && (
        <Flex
          h={12}
          position="fixed"
          w="full"
          justifyContent="center"
          gap={3}
          alignItems="center"
          bgColor="blackAlpha.800"
          zIndex={1}
        >
          <Link href="/">Home</Link>
          <Link href="/code">Code</Link>
          <Link href="/music">Music</Link>
          <Link href="/visual">Visual media</Link>
        </Flex>
      )}

      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        {props.children}
      </Flex>
    </Box>
  );
};

export { Main };
