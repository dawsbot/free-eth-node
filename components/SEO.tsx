import Head from "next/head";
import React from "react";
import chains from "../chains.min.json";

export const DEFAULT_TITLE = "Free Eth Node";
export const DEFAULT_DESCRIPTION = `A helper website so you can connect to nodes on one of ${chains.length} networks!`;
export const DEFAULT_IMAGE =
  "https://static.tweaktown.com/news/7/9/79728_01_elon-musks-spacex-will-send-an-ethereum-node-to-the-iss-this-week_full.jpg";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
};
export const SEO = (props: SEOProps) => {
  const title = props.title || DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const image = props.image || DEFAULT_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="og:title" key="og:title" content={title} />
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="description" key="description" content={description} />
      <meta name="og:description" key="og:description" content={description} />
      {/* favicon */}
      <link
        rel="icon"
        href={
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/money-with-wings_1f4b8.png"
        }
      />
      <link rel="manifest" href="/manifest.json" />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={description}
      />
      <meta name="twitter:image" key="twitter:image" content={image} />
      <meta
        name="twitter:card"
        key="twitter:card"
        content="summary_large_image"
      />
      <meta name="og:image" key="og:image" content={image} />
    </Head>
  );
};
