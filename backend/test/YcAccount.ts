import { expect } from "chai";
import { ZeroAddress } from "ethers";
import { network } from "hardhat";
import fc from "fast-check";

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

    await registry.createAccount(strategy, 0, 86400);
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

    describe("close", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithAllocation());

            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });
        });

        it("Should close", async () => {
            expect(await registry.accounts(user1)).to.be.equal(account);
            expect(await account.owner()).to.be.equal(user1);
            expect(await account.isEnabled()).to.be.equal(true);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("10000", 6));
            const ethBalance0 = await ethers.provider.getBalance(user1);

            const tx = await account.close();
            const receipt = await tx.wait();
            const gasUsed: bigint = receipt.gasUsed;
            const gasPrice: bigint = tx.gasPrice || receipt.effectiveGasPrice;
            const cost: bigint = gasUsed * gasPrice;

            expect(await registry.accounts(user1)).to.be.equal(ZeroAddress);
            expect(await account.owner()).to.be.equal(ZeroAddress);
            expect(await ethers.provider.getBalance(user1)).to.be.equal(ethBalance0 + ethers.parseEther("1") - cost);
            expect(await account.isEnabled()).to.be.equal(false);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("15000", 6));
        });

        it("Should emit a Closed event", async () => {
            await expect(account.close()).to.emit(account, "Closed");
        });

        it("Should emit a AccountClosed event", async () => {
            await expect(account.close()).to.emit(registry, "AccountClosed").withArgs(user1, account);
        });

        it("Only owner could close", async () => {
            await expect(account.connect(user2).close()).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });
    });

    describe("transferOwnership", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithAllocation());
        });

        it("Should transfer ownership", async () => {
            expect(await registry.accounts(user1)).to.be.equal(account);
            expect(await account.owner()).to.be.equal(user1);

            await account.transferOwnership(user2);

            expect(await registry.accounts(user2)).to.be.equal(account);
            expect(await account.owner()).to.be.equal(user2);
        });

        it("Should emit a AccountTransfered event", async () => {
            await expect(account.transferOwnership(user2)).to.emit(registry, "AccountTransfered").withArgs(user1, user2);
        });

        it("Only owner transfer ownership", async () => {
            await expect(account.connect(user2).transferOwnership(user2)).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });

        it("Should revert when the new onwer has already an account", async () => {
            await registry.connect(user2).createAccount(strategy, 0, 86400);

            await expect(account.transferOwnership(user2)).to.be.revertedWithCustomError(registry, "AccountAlreadyExists");
        });
    });

    describe("disableReallocation", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());
        });

        it("Should disable reallocation", async () => {
            expect(await account.isReallocationEnabled()).to.be.equal(true);

            await account.disableReallocation();

            expect(await account.isReallocationEnabled()).to.be.equal(false);
        });

        it("Should emit a ReallocationDisabled event", async () => {
            await expect(account.disableReallocation()).to.emit(account, "ReallocationDisabled");
        });

        it("Only owner could disable reallocation", async () => {
            await expect(account.connect(user2).disableReallocation()).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });

        it("Should revert when the reallocation is already disabled", async () => {
            await account.disableReallocation();

            await expect(account.disableReallocation()).to.be.revertedWithCustomError(account, "ReallocationAlreadyDisabled");
        });
    });

    describe("enableReallocation", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());
        });

        it("Should enable reallocation", async () => {
            await account.disableReallocation();

            expect(await account.isReallocationEnabled()).to.be.equal(false);

            await account.enableReallocation();

            expect(await account.isReallocationEnabled()).to.be.equal(true);
        });

        it("Should emit a ReallocationEnabled event", async () => {
            await account.disableReallocation();

            await expect(account.enableReallocation()).to.emit(account, "ReallocationEnabled");
        });

        it("Only owner could enable reallocation", async () => {
            await account.disableReallocation();

            await expect(account.connect(user2).enableReallocation()).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });

        it("Should revert when the reallocation is already enabled", async () => {
            await expect(account.enableReallocation()).to.be.revertedWithCustomError(account, "ReallocationAlreadyEnabled");
        });
    });

    describe("setNoReallocationPeriod", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());
        });

        it("Should set the no reallocation period", async () => {
            expect(await account.noReallocationPeriod()).to.be.equal(86_400);

            await account.setNoReallocationPeriod(172_800);

            expect(await account.noReallocationPeriod()).to.be.equal(172_800);
        });

        it("Should emit a NoReallocationPeriodUpdated event", async () => {
            await expect(account.setNoReallocationPeriod(172_800)).to.emit(account, "NoReallocationPeriodUpdated").withArgs(86_400, 172_800);
        });

        it("Only owner could set the no reallocation period", async () => {
            await expect(account.connect(user2).setNoReallocationPeriod(0)).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });
    });

    describe("getUsdcBalance", () => {
        
        it("Should revert when the account is disabled", async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());

            await account.close();

            await expect(account.getUsdcBalance()).to.be.revertedWithCustomError(account, "Disabled");
        });
    });

    describe("allocate", () => {

        it("Should deposit USDC to the best vault", async () => {
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

        it("Should emit a USDCAllocated event", async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());

            await expect(account.allocate()).to.emit(account, "USDCAllocated").withArgs(ethers.parseUnits("5000", 6), vault2);
        });

        it("Should revert when the strategy has no vault", async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());

            await expect(account.allocate()).to.be.revertedWithCustomError(account, "NoVault");
        });

        it("Should revert when the account is disabled", async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithVaults());

            await account.close();

            await expect(account.allocate()).to.be.revertedWithCustomError(account, "Disabled");
        });

        it("Fuzzing test", async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2 } = await setupWithVaults());

            await fc.assert(
                fc.asyncProperty(
                    fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                    async (amount: bigint) => {
                        await usdc.faucet(account, amount);
                        
                        const balance = await usdc.balanceOf(account);
                        if (balance === 0n) {
                            await expect(account.allocate()).to.be.revertedWithCustomError(account, "NoUSDC");
                        } else {
                            const depositAmount = await account.depositAmount();
                            const capital = await account.capital();

                            await account.allocate();

                            expect(await account.depositAmount()).to.be.equal(depositAmount + balance);
                            expect(await account.capital()).to.be.equal(capital + balance);
                        }
                    }
                )
            );
        });
    });

    describe("receive", () => {

        it("Should emit a ETHReceived event", async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());
            
            const tx = await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });

            expect(tx).to.emit(account, "ETHReceived").withArgs(user1, ethers.parseEther("1"));
        });
        
        it("Should revert when the account is disabled", async () => {
            ({ user1, user2, usdc, registry, strategy, account } = await setupWithoutVault());

            await account.close();
            
            await expect(user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            })).to.be.revertedWithCustomError(account, "Disabled");
        });
    });

    describe("checkReallocation", () => {
        
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, strategy, account, vault1, vault2 } = await setupWithAllocation());
        });

        it("Should revert when the account has less ETH than ETH fixed fee", async () => {
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

        it("Should revert when currently within the no-reallocation period", async () => {
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

        it("Should revert when the best vault is the current vault", async () => {
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

        it("Should return data when not currently in the no-reallocation period and the best vault is not the current vault", async () => {
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

        it("Should revert when the account is disabled", async () => {
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

            await account.close();

            await expect(account.checkReallocation()).to.be.revertedWithCustomError(account, "Disabled");
        });
    })

    describe("reallocate", () => {
        
        beforeEach(async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate } = await setupWithAllocation());
        });

        it("Should revert when the account has less ETH than ETH fixed fee", async () => {
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

        it("Should revert when currently within the no-reallocation period", async () => {
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

        it("Should revert when the best vault is the current vault", async () => {
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

        it("Should revert when the account is disabled", async () => {
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

            await account.close();

            await expect(account.reallocate()).to.be.revertedWithCustomError(account, "Disabled");
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

            it("Should reallocate from vault2 to vault1", async () => {
                expect(await ethers.provider.getBalance(account)).to.be.equal(ethers.parseEther("1"));

                expect(await yct.balanceOf(user1)).to.be.equal(ethers.parseUnits("1", 18));

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

                expect(await yct.balanceOf(user1)).to.be.equal(ethers.parseUnits("2", 18));

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

            it("Should emit a USDCAllocated event", async () => {
                await vault2.incAssets(ethers.parseUnits("300", 6)); // +6%

                // 5 261.90 - 13.095 = 5 248.805
                await expect(account.reallocate()).to.emit(account, "USDCAllocated").withArgs(ethers.parseUnits("5248.805", 6), vault1);
            });

            it("Should emit a USDCDisallocated event", async () => {
                await expect(account.reallocate()).to.emit(account, "USDCDisallocated").withArgs(ethers.parseUnits("5000", 6), 0, vault2);
            });

            it("Fuzzing test", async () => {
                await account.setNoReallocationPeriod(0);

                let netAPYs = [
                    85e3, // 8,5 % net APY
                    8e4,  // 8 % net APY
                ];

                await fc.assert(
                    fc.asyncProperty(
                        fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                        fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                        async (incAmountVault1: bigint, incAmountVault2: bigint) => {
                            await registry.updateStrategyVaultsNetAPY(strategy, [
                                vault1,
                                vault2
                            ], netAPYs);
                            netAPYs = netAPYs.reverse();

                            await vault1.incAssets(incAmountVault1);
                            await vault2.incAssets(incAmountVault2);
                            await account.reallocate();

                            expect(await account.capital()).to.be.equal(ethers.parseUnits("5000", 6));
                        }
                    )
                );
            });
        })
    })

    describe("withdraw", () => {
        
        beforeEach(async () => {
            ({ user1, user2, usdc, yct, registry, strategy, account, vault1, vault2, ethFixedReallocationFee, usdcYieldFeeRate } = await setupWithAllocation());
            
            const tx = await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("1")
            });
        });

        it("Should withdraw all USDC and ETH", async () => {
            const ethBalance0 = await ethers.provider.getBalance(user1);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("10000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await ethers.provider.getBalance(account)).to.be.equal(ethers.parseEther("1"));
            const [ usdcBalance0, usdcBalanceFromVault0 ] = await account.getUsdcBalance();
            expect(usdcBalance0).to.be.equal(0);
            expect(usdcBalanceFromVault0).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await account.capital()).to.be.equal(ethers.parseUnits("5000", 6));
            
            const tx = await account.withdraw(ethers.parseUnits("5000", 6), ethers.parseEther("1"));
            const receipt = await tx.wait();
            const gasUsed: bigint = receipt.gasUsed;
            const gasPrice: bigint = tx.gasPrice || receipt.effectiveGasPrice;
            const cost: bigint = gasUsed * gasPrice;

            expect(await ethers.provider.getBalance(user1)).to.be.equal(ethBalance0 + ethers.parseEther("1") - cost);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("15000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(0);
            expect(await ethers.provider.getBalance(account)).to.be.equal(0);
            const [ usdcBalance1, usdcBalanceFromVault1 ] = await account.getUsdcBalance();
            expect(usdcBalance1).to.be.equal(0);
            expect(usdcBalanceFromVault1).to.be.equal(0);
            expect(await vault2.balanceOf(account)).to.be.equal(0);
            expect(await account.capital()).to.be.equal(0);
        });

        it("Should withdraw a part of USDC and ETH", async () => {
            const ethBalance0 = await ethers.provider.getBalance(user1);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("10000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await ethers.provider.getBalance(account)).to.be.equal(ethers.parseEther("1"));
            const [ usdcBalance0, usdcBalanceFromVault0 ] = await account.getUsdcBalance();
            expect(usdcBalance0).to.be.equal(0);
            expect(usdcBalanceFromVault0).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(ethers.parseUnits("5000", 6));
            expect(await account.capital()).to.be.equal(ethers.parseUnits("5000", 6));
            
            const tx = await account.withdraw(ethers.parseUnits("4000", 6), ethers.parseEther("1"));
            const receipt = await tx.wait();
            const gasUsed: bigint = receipt.gasUsed;
            const gasPrice: bigint = tx.gasPrice || receipt.effectiveGasPrice;
            const cost: bigint = gasUsed * gasPrice;

            expect(await ethers.provider.getBalance(user1)).to.be.equal(ethBalance0 + ethers.parseEther("1") - cost);
            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("14000", 6));
            expect(await usdc.balanceOf(vault2)).to.be.equal(ethers.parseUnits("1000", 6));
            expect(await ethers.provider.getBalance(account)).to.be.equal(0);
            const [ usdcBalance1, usdcBalanceFromVault1 ] = await account.getUsdcBalance();
            expect(usdcBalance1).to.be.equal(0);
            expect(usdcBalanceFromVault1).to.be.equal(ethers.parseUnits("1000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(ethers.parseUnits("1000", 6));
            expect(await account.capital()).to.be.equal(ethers.parseUnits("1000", 6));
        });

        it("Should emit a ETHWithdrawn event", async () => {
            await expect(account.withdraw(ethers.parseUnits("4000", 6), ethers.parseEther("1"))).to.emit(account, "ETHWithdrawn").withArgs(ethers.parseEther("1"));
        });

        it("Only owner could withdraw USDC and ETH", async () => {
            await expect(account.connect(user2).withdraw(ethers.parseUnits("4000", 6), ethers.parseEther("1"))).to.be.revertedWithCustomError(account, "OwnableUnauthorizedAccount");
        });

        it("Should revert when the account has not enough ETH", async () => {
            await expect(account.withdraw(ethers.parseUnits("4000", 6), ethers.parseEther("2"))).to.be.revertedWithCustomError(account, "NotEnoughETH");
        });

        it("Should revert when the account has not enough USDC", async () => {
            await expect(account.withdraw(ethers.parseUnits("10000", 6), ethers.parseEther("1"))).to.be.revertedWithCustomError(account, "NotEnoughUSDC");
        });

        it("Fuzzing test", async () => {
            await usdc.faucet(account, 10_000_000_000_000_000_000n);
            await account.allocate();

            await user1.sendTransaction({
                to: account,
                value: ethers.parseEther("9000")
            });

            await fc.assert(
                fc.asyncProperty(
                    fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                    fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                    fc.bigInt({ min: 0n, max: 100_000_000_000_000_000n }),
                    async (incAssets: bigint, usdcAmount: bigint, ethAmount: bigint) => {
                        if (usdcAmount === 0n && ethAmount === 0n) {
                            await expect(account.withdraw(usdcAmount, ethAmount)).to.be.revertedWithCustomError(account, "NoAmount");
                        } else {
                            await vault2.incAssets(incAssets);

                            await account.withdraw(usdcAmount, ethAmount);
                        }
                    }
                )
            );
        });
    });
});
