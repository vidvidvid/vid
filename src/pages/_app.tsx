import '../static/frame.css';
import '../static/hover.css';
import '../styles/globals.css';
import '@fontsource/sono';

import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import type { CursorMode } from '@/components/CrazyCursor';

const CrazyCursor = dynamic(() => import('@/components/CrazyCursor'), {
  ssr: false,
});

const ROUTE_MODE: Record<string, CursorMode> = {
  '/': 'home',
  '/code': 'code',
  '/music': 'music',
  '/imagery': 'imagery',
  '/words': 'words',
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const mode = ROUTE_MODE[router.pathname] || 'home';

  return (
    <>
      <CrazyCursor mode={mode} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
