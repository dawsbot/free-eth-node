const fs = require("fs");

async function main() {
  let toReturn = [];
  await fetch("https://chainid.network/chains.json")
    .then((res) => res.json())
    .then((datas) => {
      datas.forEach((data) => {
        const firstValidRpc = data.rpc.find((rpc) => !rpc.includes("{"));

        // skip networks with no free nodes - ropsten, rinkeby, etc.
        if (firstValidRpc) {
          const chainData = {
            rpc: firstValidRpc,
            name: data.name,
            chain: data.chain,
            shortName: data.shortName,
          };

          toReturn.push(chainData);
        }
      });
    });

  fs.writeFileSync("./chains.min.json", JSON.stringify(toReturn, null, 2));
  return "done";
}

main().then(console.log);
