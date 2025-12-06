import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

const usdcAdress = "0x361680F6052786187dFEe22355eD18113A8de3DC";
const userAddress = "0xce044426aa089ec2167f94f54141019e3a0e7063";
const amount = ethers.parseUnits("10000", 6);

async function main(): Promise<void> {
    const usdc = await ethers.getContractAt("MockUSDC", usdcAdress);

    const tx = await usdc.faucet(userAddress, amount);
    await tx.wait();
    console.log(amount + " UDSC minted for " + userAddress);
}

await main().catch((error) => {
    console.error(error);
});