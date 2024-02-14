// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";
import chains from "../../chains.min.json";

type Data = {
  error: string;
};

const isDev = process.env.NODE_ENV !== "production";
const allShortNames = chains.map((chain) => chain.shortName.toLowerCase());

const myCache = new NodeCache({
  stdTTL: 60 * 60 * 24 /* one day */,
  checkperiod: 30 /* check every 30 seconds */,
});
const DAILY_REQUEST_LIMIT_PER_IP_ADDRESS = 1_000;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ipAddress = (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "missing"
  ).toString();
  const usedTimes = myCache.get(ipAddress) as number | undefined;
  if (
    typeof usedTimes === "number" &&
    usedTimes > DAILY_REQUEST_LIMIT_PER_IP_ADDRESS
  ) {
    console.warn(`ip "${ipAddress}" is over their limit. Blocking`);
    return res.status(400).json({
      error:
        "You've reached your limit on free-eth-handler. Come back in a day",
    });
  }

  const network = (req.query.network as string).toLowerCase();
  if (!allShortNames.includes(network)) {
    return res.status(400).json({
      error: `Network '${network}' not supported. Please use ${allShortNames
        .map((network) => `'${network}'`)
        .join(", ")}`,
    });
  }
  if (isDev) {
    console.dir({
      body: req.body,
      params1: req.body.params?.[0],
      params2: req.body.params?.[1],
    });
  }
  myCache.set(ipAddress, typeof usedTimes === "number" ? usedTimes + 1 : 2);
  const rpc = (
    chains.find((chain) => chain.shortName === network) || { rpc: "bad" }
  ).rpc;
  const ethNodeResponse = await fetch(rpc, {
    method: "post",
    body: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as any);
  return res.status(200).json(ethNodeResponse);
}
