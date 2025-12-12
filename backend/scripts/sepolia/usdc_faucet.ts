import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

const usdcAdress = "0x361680F6052786187dFEe22355eD18113A8de3DC";
const userAddress = undefined;
const amount = ethers.parseUnits("10000", 6);

async function main(): Promise<void> {
    if (userAddress == undefined) {
        throw Error("userAddress undefined");
    }

    const usdc = await ethers.getContractAt("MockUSDC", usdcAdress);

    const tx = await usdc.faucet(userAddress, amount);
    await tx.wait();
    console.log(amount + " UDSC minted for " + userAddress);
}

await main().catch((error) => {
    console.error(error);
});