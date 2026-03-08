import { Flex } from '@chakra-ui/react';
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
    <div
      style={{
        height: isHome ? '100vh' : 'auto',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
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
          <Link href="/imagery">Imagery</Link>
          <Link href="/words">Words</Link>
        </Flex>
      )}

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: isHome ? '100%' : 'auto',
          minHeight: isHome ? '100%' : undefined,
          justifyContent: 'center',
          alignItems: isHome ? 'center' : 'flex-start',
          flexDirection: 'column',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export { Main };
