// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import NodeCache from "node-cache";
import chains from "../../chains.min.json";

const ipAddressDailyLimit = 10000;

type Data = {
  error: string;
};
const myCache = new NodeCache({
  stdTTL: 60 * 60 * 24 /* one day */,
  checkperiod: 30 /* check every 30 seconds */,
});

const isDev = process.env.NODE_ENV !== "production";
const allShortNames = chains.map((chain) => chain.shortName);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ipAddress = (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "missing"
  ).toString();
  const usedTimes = myCache.get(ipAddress);
  if (typeof usedTimes === "number" && usedTimes > ipAddressDailyLimit) {
    return res.status(400).json({
      error:
        "You've reached your limit on free-eth-handler. Come back in a day",
    });
  }
  const network = req.query.network as string;
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
  } else {
    myCache.set(ipAddress, typeof usedTimes === "number" ? usedTimes + 1 : 1);
    console.log({ ipAddress, usedTimes });
  }
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
