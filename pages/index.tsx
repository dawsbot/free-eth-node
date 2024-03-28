import type { NextPage } from "next";
import React from "react";
import chainsData from "../chains.min.json";
import { SEO } from "../components/SEO";
import styles from "../styles/Home.module.css";

type ChainsData = Readonly<typeof chainsData>;
const Home: NextPage = () => {
  const [visibleChains, setVisibleChains] = React.useState<ChainsData>([
    ...chainsData,
  ]);
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value.toLowerCase();
    setSearchValue(value);
    const newChains: ChainsData = [...chainsData].filter((chain) => {
      const shouldInclude = JSON.stringify(chain).toLowerCase().includes(value);
      return shouldInclude;
    });

    setVisibleChains(newChains);
  };
  return (
    <>
      <SEO />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <code className={styles.code}>free-eth-node!</code>
          </h1>

          <p className={styles.description}>
            Start projects quickly on any EVM network.
            <br />
            <code style={{ fontSize: "18px" }}>
              Limit of 1,000 requests per day
            </code>
          </p>

          <b style={{ marginBottom: "8px" }}>Search:</b>
          <input
            className={styles.input}
            placeholder="ethereum"
            value={searchValue}
            onChange={handleSearchChange}
            style={{
              height: "40px",
              fontSize: "17px",
              padding: "10px",
              borderRadius: "4px",
              minWidth: "240px",
            }}
          />

          <div className={styles.grid}>
            {visibleChains.map(({ rpc, name, chain, shortName }) => (
              <div className={styles.card} key={`${chain}-${shortName}`}>
                <h2>
                  {name} ({chain})
                </h2>
                <div
                  className={styles.code}
                >{`https://free-eth-node.com/api/${shortName}`}</div>
              </div>
            ))}
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://github.com/dawsbot"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
            }}
          >
            Built by daws.eth
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;
