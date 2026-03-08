import '../static/frame.css';
import '../static/hover.css';
import '@fontsource/sono';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { system } from '@/utils/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider value={system}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
