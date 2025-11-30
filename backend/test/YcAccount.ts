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

    const ethFixedReallocationFee = ethers.parseEther("0.00004");
    const usdcYieldFeeRate = ethers.parseUnits("5", 3); // 5 %
    const registry = await ethers.deployContract("YcRegistry", [ usdc, ethFixedReallocationFee, usdcYieldFeeRate ]);

    await registry.grantBotRole(user1);

    await strategy.transferOwnership(registry);
    await registry.addStrategy(strategy);

    await registry.createAccount(strategy, 0, 86400)
    const accountAddress = await registry.accounts(user1);
    const account = await ethers.getContractAt("YcAccount", accountAddress);

    await usdc.faucet(account, 5_000_000_000);

    return { user1, user2, registry, usdc, strategy, account, ethFixedReallocationFee, usdcYieldFeeRate };
}

async function setupWithVaults() {
    ({ user1, user2, usdc, registry, strategy, account, ethFixedReallocationFee, usdcYieldFeeRate } = await setupWithoutVault());

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("12", 16); // 12e16 => 12 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);

    await registry.addStrategyVault(strategy, vault1);
    await registry.addStrategyVault(strategy, vault2);
    
    await registry.updateStrategyVaultsNetAPY(strategy, [
        vault1,
        vault2
    ], [
        8e4,  // 8 % net APY
        85e3, // 8,5 % net APY
    ]);

    const yctAddress = await registry.yct();
    const yct = await ethers.getContractAt("YcToken", yctAddress);

    return { user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate };
}

async function setupWithAllocation() {
    ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate } = await setupWithVaults());

    await account.allocate();

    return { user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate };
}

let user1: any;
let user2: any;
let usdc: any;
let yct: any;
let registry: any;
let strategy: any;
let vault1: any;
let vault2: any;
let account: any;
let ethFixedReallocationFee: any;
let usdcYieldFeeRate: any;

describe("YcAccount", () => {

    describe("setNoReallocationPeriod", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());
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
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());

            expect(await usdc.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(0);
            expect(await account.currentVault()).to.be.equal(ZeroAddress);
            expect(await account.depositAmount()).to.be.equal(0);

            const shares = await vault2.previewDeposit(ethers.parseUnits("5000", 6));

            await account.allocate();

            expect(await usdc.balanceOf(account)).to.be.equal(0);
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(shares);
            expect(await account.currentVault()).to.be.equal(vault2);
            expect(await account.depositAmount()).to.be.equal(ethers.parseUnits("5000", 6));
        });

        it("Should emit a USDCAllocated event", async function () {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());

            await expect(account.allocate()).to.emit(account, "USDCAllocated").withArgs(ethers.parseUnits("5000", 6), vault2);
        });

        it("Should revert when the strategy has no vault", async function () {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());

            await expect(account.allocate()).to.be.revertedWithCustomError(account, "NoVault");
        });
    });

    describe("receive", () => {

        it("Should emit a ETHReceived event", async function () {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());
            
            const tx = await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            expect(tx).to.emit(account, "ETHReceived").withArgs(user1, ethers.parseEther("1"));
        });
    });

    describe("checkReallocation", () => {
        
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account, vault1, vault2 } = await setupWithAllocation());
        });

        it("Should revert when the account has less ETH than ETH fixed fee", async function () {
            expect(await account.currentVault()).to.be.equal(vault2);

            await registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            await expect(account.checkReallocation()).to.be.revertedWithCustomError(account, "NotEnoughETH");
        });

        it("Should revert when currently within the no-reallocation period", async function () {
            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });
                    
            expect(await account.currentVault()).to.be.equal(vault2);

            await registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            await expect(account.checkReallocation()).to.be.revertedWithCustomError(account, "WithinNoReallocationPeriod");
        });

        it("Should revert when the best vault is the current vault", async function () {
            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            // 1 day + 1 second
            await networkHelpers.time.increase(86401);
            
            expect(await account.currentVault()).to.be.equal(vault2);

            expect(await strategy.getBestVault()).to.be.equal(vault2);

            await expect(account.checkReallocation()).to.be.revertedWithCustomError(account, "NoVaultChange");
        });

        it("Should return data when not currently in the no-reallocation period and the best vault is not the current vault", async function () {
            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            // 1 day + 1 second
            await networkHelpers.time.increase(86401);
            
            expect(await account.currentVault()).to.be.equal(vault2);

            await registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            const [ vault, ethFixedReallocationFee ] = await account.checkReallocation();
            expect(vault).to.be.equal(vault1);
            expect(ethFixedReallocationFee).to.be.equal(ethers.parseEther("0.00004"));
        });
    })

    describe("reallocate", () => {
        
        beforeEach(async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate } = await setupWithAllocation());
        });

        it("Should revert when the account has less ETH than ETH fixed fee", async function () {
            expect(await account.currentVault()).to.be.equal(vault2);

            await registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            await expect(account.reallocate()).to.be.revertedWithCustomError(account, "NotEnoughETH");
        });

        it("Should revert when currently within the no-reallocation period", async function () {
            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });
                    
            expect(await account.currentVault()).to.be.equal(vault2);

            await registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                85e3, // 8,5 % net APY
                8e4,  // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);

            await expect(account.reallocate()).to.be.revertedWithCustomError(account, "WithinNoReallocationPeriod");
        });

        it("Should revert when the best vault is the current vault", async function () {
            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            // 1 day + 1 second
            await networkHelpers.time.increase(86401);
            
            expect(await account.currentVault()).to.be.equal(vault2);

            expect(await strategy.getBestVault()).to.be.equal(vault2);

            await expect(account.reallocate()).to.be.revertedWithCustomError(account, "NoVaultChange");
        });

        describe("No revert", () => {
        
            beforeEach(async () => {
                ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithAllocation());

                await user1.sendTransaction({
                    to: account,
                    value: ethers.parseEther("1")
                });

                // 1 day + 1 second
                await networkHelpers.time.increase(86401);

                await registry.updateStrategyVaultsNetAPY(strategy, [
                    vault1,
                    vault2
                ], [
                    85e3, // 8,5 % net APY
                    8e4,  // 8 % net APY
                ]);
            });

            it("Should reallocate from vault2 to vault1", async function () {
                expect(await ethers.provider.getBalance(account)).to.be.equal(ethers.parseEther("1"));

                expect(await yct.balanceOf(account)).to.be.equal(ethers.parseUnits("1", 18));

                expect(await usdc.balanceOf(registry)).to.be.equal(0);
                expect(await usdc.balanceOf(account)).to.be.equal(0);
                expect(await usdc.balanceOf(vault1)).to.be.equal(0);
                expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));

                expect(await vault1.balanceOf(account)).to.be.equal(0);
                expect(await vault2.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));

                expect(await account.capital()).to.be.equal(ethers.parseUnits("5000", 6));
                expect(await account.currentVault()).to.be.equal(vault2);

                await vault2.incAssets(ethers.parseUnits("300", 6)); // +6%

                const redeem = await vault2.previewRedeem(ethers.parseUnits("5000", 6));
                // 5 000 + (5 300 - 5 000) * (1 - 0.007 - 0.12) = 5 261.90
                expect(redeem).to.be.equal(ethers.parseUnits("5261.9", 6));

                await account.reallocate();

                expect(await ethers.provider.getBalance(account)).to.be.lessThan(ethers.parseEther("1") - ethFixedReallocationFee);

                expect(await yct.balanceOf(account)).to.be.equal(ethers.parseUnits("2", 18));

                // 261.90 * 5% = 13.095
                const usdcFee = ethers.parseUnits("13.095", 6);
                const sharesVault1 = await vault1.previewDeposit(redeem - usdcFee);

                expect(await usdc.balanceOf(registry)).to.be.equal(usdcFee);
                expect(await usdc.balanceOf(account)).to.be.equal(0);
                expect(await usdc.balanceOf(vault1)).to.be.equal(redeem - usdcFee);
                expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5300", 6) - ethers.parseUnits("5261.9", 6));

                expect(await vault1.balanceOf(account)).to.be.equal(sharesVault1);
                expect(await vault2.balanceOf(account)).to.be.equal(0);
                
                expect(await account.capital()).to.be.equal(ethers.parseUnits("5000", 6));
                expect(await account.currentVault()).to.be.equal(vault1);
            });

            it("Should emit a USDCAllocated event", async function () {
                await vault2.incAssets(ethers.parseUnits("300", 6)); // +6%

                // 5 261.90 - 13.095 = 5 248.805
                await expect(account.reallocate()).to.emit(account, "USDCAllocated").withArgs(ethers.parseUnits("5248.805", 6), vault1);
            });

            it("Should emit a USDCDisallocated event", async function () {
                await expect(account.reallocate()).to.emit(account, "USDCDisallocated").withArgs(ethers.parseUnits("5000", 6), vault2);
            });
        })
    })
});
