import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

const usdcAdress = "0x361680F6052786187dFEe22355eD18113A8de3DC";
const botAddress = undefined;

async function main(): Promise<void> {
    if (botAddress == undefined) {
        throw Error("botAddress undefined");
    }

    const usdc = await ethers.getContractAt("MockUSDC", usdcAdress);

    const ethFixedReallocationFee = ethers.parseEther("0.00004");
    const usdcYieldFeeRate = ethers.parseUnits("5", 3); // 5 %
    const registry = await ethers.deployContract("YcRegistry", [ usdc, ethFixedReallocationFee, usdcYieldFeeRate ]);
    await registry.deploymentTransaction()?.wait();
    console.log("Registry was deployed at : " + registry.target);

    const factoryAddress = await registry.factory();
    console.log("Factory was deployed at : " + factoryAddress);

    const yctAddress = await registry.yct();
    console.log("YCT was deployed at : " + yctAddress);

    const yct = await ethers.getContractAt("YcToken", yctAddress);
    const vestingWalletAddress = await yct.teamVestingWallet();
    console.log("VestingWallet was deployed at : " + vestingWalletAddress);

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);
    await vault1.deploymentTransaction()?.wait();
    console.log("First MockMorphoVault was deployed at : " + vault1.target);

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("14", 16); // 12e16 => 14 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);
    await vault2.deploymentTransaction()?.wait();
    console.log("Second MockMorphoVault was deployed at : " + vault2.target);

    const strategy = await ethers.deployContract("YcStrategy", [ "Morpho - 2 vaults monitored", [vault1, vault2] ]);
    await strategy.deploymentTransaction()?.wait();
    console.log("Strategy was deployed at : " + strategy.target);

    let tx = await strategy.updateVaultsNetAPY([ vault1, vault2 ], [ 8_0000n, 8_5000n ]);
    await tx.wait();

    tx = await strategy.transferOwnership(registry);
    await tx.wait();
    console.log("Registry is now the owner of the strategy");

    tx = await registry.addStrategy(strategy);
    await tx.wait();
    console.log("Strategy was added to registry");

    tx = await registry.grantBotRole(botAddress);
    await tx.wait();
    console.log(botAddress + " is now an authorized bot");
}

await main().catch((error) => {
    console.error(error);
});