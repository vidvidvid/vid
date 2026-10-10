import "../styles/globals.css";
import "@fontsource/sono";

import type { AppProps } from "next/app";

import LivingCursor from "@/components/living/LivingCursor";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Component {...pageProps} />
    <LivingCursor />
  </>
);
export default MyApp;
