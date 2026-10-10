import Head from "next/head";
import { useRouter } from "next/router";

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <Head>
      <meta charSet="UTF-8" key="charset" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1"
        key="viewport"
      />
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      {props.canonical && <link rel="canonical" href={props.canonical} />}
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      {props.canonical && <meta property="og:url" content={props.canonical} />}
      <link
        rel="apple-touch-icon"
        href={`${router.basePath}/apple-touch-icon.png?v=vvv-1`}
        key="apple"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${router.basePath}/favicon-32x32.png?v=vvv-1`}
        key="icon32"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${router.basePath}/favicon-16x16.png?v=vvv-1`}
        key="icon16"
      />
      <link
        rel="icon"
        href={`${router.basePath}/favicon.ico?v=vvv-1`}
        key="favicon"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        sizes="any"
        href={`${router.basePath}/favicon.svg?v=vvv-1`}
        key="icon-svg"
      />
    </Head>
  );
};

export { Meta };
