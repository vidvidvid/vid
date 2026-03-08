import '../static/frame.css';
import '../static/hover.css';
import '../styles/globals.css';
import '@fontsource/sono';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default MyApp;
