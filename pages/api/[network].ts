// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chains from "../../chains.min.json";

type Data = {
  error: string;
};

const isDev = process.env.NODE_ENV !== "production";
const allShortNames = chains.map((chain) => chain.shortName.toLowerCase());
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
