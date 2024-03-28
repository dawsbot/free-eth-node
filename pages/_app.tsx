import type { AppProps } from "next/app";
import GithubCorner from "react-github-corner";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GithubCorner
        href="https://github.com/earnifi/free-eth-node"
        size={200}
        bannerColor={"#27ae60"}
      />

      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
