import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

async function main(): Promise<void> {
    throw Error("Already deployed");

    const usdc = await ethers.deployContract("MockUSDC");
    console.log("MockUSDC was deployed at : " + usdc.target);
}

await main().catch((error) => {
    console.error(error);
});