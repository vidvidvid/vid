import '../static/fonts.css';
import '../static/hover.css';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { theme } from '@/utils/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <CacheProvider>
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </CacheProvider>
);

export default MyApp;
