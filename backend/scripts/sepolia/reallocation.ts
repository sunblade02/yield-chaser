import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

const registryAddress = "0x936C20F30aE2D0bE4A4c72266D86B643e36d5882";

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
                const data = await account.checkReallocation();
                const tx = await account.reallocate({ gasLimit: 500000 });
                await tx.wait();
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