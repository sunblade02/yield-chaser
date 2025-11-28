import { network } from "hardhat";
import { YcRegistry } from "../../types/ethers-contracts/YcRegistry.js";

const { ethers } = await network.connect({
    network: "localhost",
});

const registryAdress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const netAPYs = [
    9_0000n,  // 9%
    8_5000n, // 8.5%
];

async function updateStrategyVaultsNetAPY(registry: YcRegistry, strategyAddress: string, vaultAddresses: string[], netAPYs: bigint[]): Promise<void> {
    await registry.updateStrategyVaultsNetAPY(strategyAddress, Array.from(vaultAddresses), netAPYs);
}

async function main(): Promise<void> {
    const registry = await ethers.getContractAt("YcRegistry", registryAdress);

    const strategyAddress = await registry.strategies(0);
    const strategy = await ethers.getContractAt("YcStrategy", strategyAddress);

    const vaultAddresses = await strategy.getVaults();

    await updateStrategyVaultsNetAPY(registry, strategyAddress, vaultAddresses, netAPYs);
    console.log("Vaults net APY updated");
}

await main().catch((error) => {
    console.error(error);
});