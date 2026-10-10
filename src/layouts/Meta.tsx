import Head from "next/head";
import { useRouter } from "next/router";

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();
  const origin = "https://vidvidvid.xyz";
  const pathname = router.pathname === "/" ? "/" : `${router.pathname}/`;
  const canonical = props.canonical ?? `${origin}${pathname}`;
  const title =
    props.title === "vidvidvid" ? props.title : `${props.title} — vidvidvid`;
  const image = `${origin}/assets/social/vidvidvid-v1.png`;
  const imageAlt =
    "vidvidvid in blue, pink and gold beside an iridescent sculpture. Code, music, imagery, words.";

  return (
    <Head>
      <meta charSet="UTF-8" key="charset" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1"
        key="viewport"
      />
      <title>{title}</title>
      <meta name="description" content={props.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="vidvidvid" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <meta name="theme-color" content="#9aadff" />
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
