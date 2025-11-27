import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "localhost",
});

async function main(): Promise<void> {
    const signers = await ethers.getSigners();

    const usdc = await ethers.deployContract("MockUSDC");
    console.log("MockUSDC was deployed at : " + usdc.target);

    for (let i = 0; i < signers.length; i++) {
        await usdc.faucet(signers[i], 10_000_000_125n);
    }

    const registry = await ethers.deployContract("YcRegistry", [ usdc ]);
    console.log("Registry was deployed at : " + registry.target);

    const factoryAddress = await registry.factory();
    console.log("Factory was deployed at : " + factoryAddress);

    const yctAddress = await registry.yct();
    console.log("YCT was deployed at : " + yctAddress);

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);
    console.log("First MockMorphoVault was deployed at : " + vault1.target);

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("14", 16); // 12e16 => 14 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);
    console.log("Second MockMorphoVault was deployed at : " + vault2.target);

    const strategy = await ethers.deployContract("YcStrategy", [ "Morpho - 2 vaults monitored", [vault1, vault2] ]);
    console.log("Strategy was deployed at : " + strategy.target);

    await strategy.updateVaultsNetAPY([ vault1, vault2 ], [ 8_0000n, 8_5000n ]);

    await strategy.transferOwnership(registry);
    console.log("Registry is now the owner of the strategy");

    await registry.addStrategy(strategy);
    console.log("Strategy was added to registry");

    await usdc.approve(registry, 1_000_000_000n);
    await registry.createAccount(strategy, 1_000_000_000n);
    const account = await registry.accounts(signers[0]);
    console.log("Account for signer 0 was created : " + account);
}

await main().catch((error) => {
    console.error(error);
});