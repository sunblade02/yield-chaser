import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "localhost",
});

const registryAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";

async function main(): Promise<void> {
    const registry = await ethers.getContractAt("YcRegistry", registryAddress);

    let i = 0;
    let max = 500;
    while (true) {
        const accounts = await registry.getAccounts(i, max);

        for (let j = 0; j < accounts.length; j++) {
            const accountAddress = accounts[j];
            console.log("Check reallocation for account " + accountAddress);

            const account = await ethers.getContractAt("YcAccount", accountAddress);
            try {
                await account.checkReallocation();
                await account.reallocate();
                console.log("✅ Reallocation done");
            } catch (error: any) {
                console.log("❌ No reallocation");
            }
        }

        i += max;
    }
}

await main().catch(() => {
});