import { Box } from '@chakra-ui/react';
// import Link from 'next/link';
import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <Box>
    {props.meta}

    {/* <Link href="/">Home</Link>
    <Link href="/about/">About</Link>
    <Link href="/blog/">Blog</Link> */}

    {props.children}
  </Box>
);

export { Main };
