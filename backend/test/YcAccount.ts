import { expect } from "chai";
import { ZeroAddress } from "ethers";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

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
    
    await strategy.updateVaultsNetAPY([
        vault1,
        vault2
    ], [
        8e4,  // 8 % net APY
        85e3, // 8,5 % net APY
    ]);

    return { user1, user2, usdc, strategy, account, vault1, vault2 };
}

async function setupWithAllocation() {
    ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithVaults());

    await account.allocate();

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

    describe("setNoReallocationPeriod", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithVaults());
        });

        it("Should set the no reallocation period", async function () {
            expect(await account.noReallocationPeriod()).to.be.equal(86_400);

            await account.setNoReallocationPeriod(172_800);

            expect(await account.noReallocationPeriod()).to.be.equal(172_800);
        });

        it("Should emit a NoReallocationPeriodUpdated event", async function () {
            await expect(account.setNoReallocationPeriod(172_800)).to.emit(account, "NoReallocationPeriodUpdated").withArgs(86_400, 172_800);
        });

        it("Only owner could set the no reallocation period", async function () {
            await expect(account.connect(user2).setNoReallocationPeriod(0)).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });
    });

    describe("allocate", () => {

        it("Should deposit USDC to the best vault", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithVaults());

            expect(await usdc.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(0);
            expect(await account.currentVault()).to.be.equal(ZeroAddress);

            const shares = await vault2.previewDeposit(ethers.parseUnits("5000", 6));

            await account.allocate();

            expect(await usdc.balanceOf(account)).to.be.equal(0);
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(shares);
            expect(await account.currentVault()).to.be.equal(vault2);
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

    describe("checkReallocation", () => {

        it("Should return false if currently within the no-reallocation period", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithAllocation());
            
            expect(await account.currentVault()).to.be.equal(vault2);

            await strategy.updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            expect(await account.checkReallocation()).to.be.equal(false);
        });

        it("Should return false if the best vault is the current vault", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithAllocation());

            // 1 day + 1 second
            await networkHelpers.time.increase(86401);
            
            expect(await account.currentVault()).to.be.equal(vault2);

            expect(await strategy.getBestVault()).to.be.equal(vault2);

            expect(await account.checkReallocation()).to.be.equal(false);
        });

        it("Should return true if not currently in the no-reallocation period and the best vault is not the current vault", async function () {
            ({ user1, user2, usdc, strategy, account, vault1, vault2 } = await setupWithAllocation());

            // 1 day + 1 second
            await networkHelpers.time.increase(86401);
            
            expect(await account.currentVault()).to.be.equal(vault2);

            await strategy.updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            expect(await account.checkReallocation()).to.be.equal(true);
        });
    })
});
