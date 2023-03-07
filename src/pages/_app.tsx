import '../static/frame.css';
import '../static/hover.css';
import '@fontsource/sono';

// import 'hover.css';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { theme } from '@/utils/theme';

const ForceDarkMode: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'dark') return;
    toggleColorMode();
  }, [colorMode, toggleColorMode]);

  return children;
};

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider resetCSS theme={theme}>
    <ForceDarkMode>
      <Component {...pageProps} />
    </ForceDarkMode>
  </ChakraProvider>
);

export default MyApp;
