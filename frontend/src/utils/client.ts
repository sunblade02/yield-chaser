import { createPublicClient, http } from "viem";
import { type Chain, hardhat, sepolia } from "viem/chains";

const ENV = process.env.NEXT_PUBLIC_ENV || "dev";
const RPC = process.env.NEXT_PUBLIC_INFURA_RPC || "";

let chain: Chain = hardhat;
switch (ENV) {
    case "staging":
        chain = sepolia;
        break;
}

export const publicClient = createPublicClient({
    chain: chain,
    transport: http(RPC),
});