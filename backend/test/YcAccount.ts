import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setupWithoutVault() {
    const [user1, user2] = await ethers.getSigners();

    const usdc = await ethers.deployContract("MockUSDC");
    await usdc.faucet(user1, 10_000_000_000);
    await usdc.faucet(user2, 10_000_000_000);

    const strategy = await ethers.deployContract("YcStrategy", [ "Strategy 1", [] ]);

    const account = await ethers.deployContract("YcAccount", [ usdc, strategy, user1 ]);
    await usdc.faucet(account, 5_000_000_000);

    return { user1, user2, usdc, strategy, account };
}

async function setupWithVaults() {
    ({ user1, user2, usdc, strategy, account } = await setupWithoutVault());

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("12", 16); // 12e16 => 14 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);

    await strategy.addVault(vault1);
    await strategy.addVault(vault2);
    
    strategy.updateVaultsNetAPY([
        vault1,
        vault2
    ], [
        8e4,  // 8 % net APY
        85e3, // 8,5 % net APY
    ]);

    return { user1, user2, usdc, strategy, account, vault1, vault2 };
}

let user1: any;
let user2: any;
let usdc: any;
let strategy: any;
let vault1: any;
let vault2: any;
let account: any;

describe("YcAccount", () => {

    describe("allocate", () => {

        it("Should deposit USDC to the best vault", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithVaults());


            expect(await usdc.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(0);

            const shares = await vault2.previewDeposit(ethers.parseUnits("5000", 6));

            await account.allocate();

            expect(await usdc.balanceOf(account)).to.be.equal(0);
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(shares);
        });

        it("Should emit a USDCAllocated event", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithVaults());

            await expect(account.allocate()).to.emit(account, "USDCAllocated").withArgs(ethers.parseUnits("5000", 6), vault2);
        });

        it("Should revert when the strategy has no vault", async function () {
            ({ user1, user2, usdc, strategy, account } = await setupWithoutVault());

            await expect(account.allocate()).to.be.revertedWithCustomError(account, "NoVault");
        });
    });

    describe("receive", () => {

        it("Should emit a ETHReceived event", async function () {
            ({ user1, user2, usdc, strategy, account } = await setupWithoutVault());
            
            const tx = await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            expect(tx).to.emit(account, "ETHReceived").withArgs(user1, ethers.parseEther("1"));
        });
    });
});
