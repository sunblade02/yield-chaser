import { network } from "hardhat";
import { YcAccount } from "../../types/ethers-contracts/index.js";

const { ethers } = await network.connect({
    network: "localhost",
});

const accountAdress = "0x2408AfBfa81775DF2Eb9D0c108d1150A16E1872a";

async function checkReallocation(account: YcAccount): Promise<[string, bigint]> {
    return await account.checkReallocation();
}

async function main(): Promise<void> {
    const account = await ethers.getContractAt("YcAccount", accountAdress);

    const res = await checkReallocation(account);
    console.log("Reallocation : " + res);
}

await main().catch((error) => {
    console.error(error);
});