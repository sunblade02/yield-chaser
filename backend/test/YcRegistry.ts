import { expect } from "chai";
import { ZeroAddress } from "ethers";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setupWithoutStrategy() {
    const [user1, user2] = await ethers.getSigners();

    const usdc = await ethers.deployContract("MockUSDC");
    await usdc.faucet(user1, ethers.parseUnits("10000", 6));
    await usdc.faucet(user2, ethers.parseUnits("10000", 6));

    const ethFixedReallocationFee = ethers.parseEther("0.00004");
    const usdcYieldFeeRate = ethers.parseUnits("5", 3); // 5 %
    const registry = await ethers.deployContract("YcRegistry", [ usdc, ethFixedReallocationFee, usdcYieldFeeRate ]);

    const yctAddress = await registry.yct();
    const yct = await ethers.getContractAt("YcToken", yctAddress);

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("12", 16); // 12e16 => 14 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);

    const strategy = await ethers.deployContract("YcStrategy", [ "Strategy 1", [vault1, vault2] ]);
    
    await strategy.updateVaultsNetAPY([
        vault1,
        vault2
    ], [
        8e4,  // 8 % net APY
        85e3, // 8,5 % net APY
    ]);

    return { user1, user2, usdc, registry, yct, strategy, vault1, vault2 };
}

async function setupWithStrategy() {
    ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());

    await strategy.transferOwnership(registry);

    await registry.addStrategy(strategy);

    await usdc.approve(registry, ethers.parseUnits("10000", 6));

    return { user1, user2, usdc, registry, yct, strategy, vault1, vault2 };
}

async function setupWithAuthorizedBot() {
    ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithStrategy());

    const signers = await ethers.getSigners();
    const bot = signers[2];

    await registry.grantBotRole(bot);

    return { user1, user2, bot, usdc, registry, yct, strategy, vault1, vault2 };
}

let user1: any;
let user2: any;
let bot: any;
let usdc: any;
let registry: any;
let yct: any;
let strategy: any;
let vault1: any;
let vault2: any;

describe("YcRegistry", () => {

    describe("receive", () => {
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });
        
        it("Should emit a ETHReceived event", async function () {
            const tx = await user1.sendTransaction({
                to: registry,
                value: ethers.parseEther("1")
            });

            expect(tx).to.emit(registry, "ETHReceived").withArgs(user1, ethers.parseEther("1"));
        });
    });

    describe("grantBotRole", () => {
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });

        it("Should grant bot role", async function () {
            const botRole = await registry.BOT_ROLE();
            expect(await registry.hasRole(botRole, user2)).to.be.equal(false);

            await registry.grantBotRole(user2);

            expect(await registry.hasRole(botRole, user2)).to.be.equal(true);
        });

        it("Should emit a RoleGranted event", async function () {
            const botRole = await registry.BOT_ROLE();
            await expect(registry.grantBotRole(user2)).to.emit(registry, "RoleGranted").withArgs(botRole, user2, user1);
        });

        it("Only admin could grant bot role", async function () {
            await expect(registry.connect(user2).grantBotRole(user2)).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });
    });

    describe("revokeBotRole", () => {
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });

        it("Should revoke bot role", async function () {
            const botRole = await registry.BOT_ROLE();
            
            await registry.grantBotRole(user2);

            expect(await registry.hasRole(botRole, user2)).to.be.equal(true);

            await registry.revokeBotRole(user2);

            expect(await registry.hasRole(botRole, user2)).to.be.equal(false);
        });

        it("Should emit a RoleRevoked event", async function () {
            const botRole = await registry.BOT_ROLE();
            
            await registry.grantBotRole(user2);

            await expect(registry.revokeBotRole(user2)).to.emit(registry, "RoleRevoked").withArgs(botRole, user2, user1);
        });

        it("Only admin could grant bot role", async function () {
            await registry.grantBotRole(user2);

            await expect(registry.connect(user2).revokeBotRole(user2)).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });
    });

    describe("addStrategy", () => {
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });

        it("Should add an strategy", async function () {
            await expect(registry.strategies(0)).to.be.revertedWithoutReason(ethers);
            expect(await registry.allowedStrategies(strategy)).to.be.equal(false);

            await strategy.transferOwnership(registry);
            await registry.addStrategy(strategy);

            expect(await registry.strategies(0)).to.be.equal(strategy);
            expect(await registry.allowedStrategies(strategy)).to.be.equal(true);
        });

        it("Should emit a StrategyAdded event", async function () {
            await strategy.transferOwnership(registry);

            await expect(registry.addStrategy(strategy)).to.emit(registry, "StrategyAdded");
        });

        it("Only admin could add a strategy", async function () {
            await strategy.transferOwnership(registry);

            await expect(registry.connect(user2).addStrategy(strategy)).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });

        it("Only an onwed strategy can be added", async function () {
            await expect(registry.addStrategy(strategy)).to.be.revertedWithCustomError(registry, "NotStrategyOwner");
        });
    });

    describe("setEthFixedReallocationFee", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });

        it("Should set ETH fixed reallocation fee", async function () {
            expect(await registry.ethFixedReallocationFee()).to.be.equal(ethers.parseEther("0.00004"));

            await registry.setEthFixedReallocationFee(ethers.parseEther("0.00005"));

            expect(await registry.ethFixedReallocationFee()).to.be.equal(ethers.parseEther("0.00005"));
        });

        it("Should emit a EthFixedReallocationFeeSet event", async function () {
            await expect(registry.setEthFixedReallocationFee(ethers.parseEther("0.00005"))).to.emit(registry, "EthFixedReallocationFeeSet").withArgs(ethers.parseEther("0.00004"), ethers.parseEther("0.00005"));
        });

        it("Only admin could set ETH fixed reallocation fee", async function () {
            await expect(registry.connect(user2).setEthFixedReallocationFee(ethers.parseEther("0.00005"))).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });
    });

    describe("setUsdcYieldFeeRate", () => {

        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithoutStrategy());
        });

        it("Should set USDC yield fee rate", async function () {
            expect(await registry.usdcYieldFeeRate()).to.be.equal(ethers.parseUnits("5", 3));

            await registry.setUsdcYieldFeeRate(ethers.parseUnits("65", 2));

            expect(await registry.usdcYieldFeeRate()).to.be.equal(ethers.parseUnits("65", 2));
        });

        it("Should emit a UsdcYieldFeeRateSet event", async function () {
            await expect(registry.setUsdcYieldFeeRate(ethers.parseUnits("65", 2))).to.emit(registry, "UsdcYieldFeeRateSet").withArgs(ethers.parseUnits("5", 3), ethers.parseUnits("65", 2));
        });

        it("Only admin could set USDC yield fee rate", async function () {
            await expect(registry.connect(user2).setUsdcYieldFeeRate(ethers.parseUnits("65", 2))).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });
    });

    describe("createAccount", () => {
        beforeEach(async () => {
            ({ user1, user2, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithStrategy());
        });

        it("Should create an account", async function () {
            expect(await registry.accounts(user1)).to.be.equal(ZeroAddress);

            await registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            });

            expect(await registry.accounts(user1)).not.to.be.equal(ZeroAddress);
        });

        it("Should transfer ETH to the new account", async function () {
            await registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            });

            const account = await registry.accounts(user1);

            expect(await ethers.provider.getBalance(account)).to.be.equal(ethers.parseEther("0.001"));
        });

        it("Should mint 1 YCT for the new account", async function () {
            expect(await yct.totalSupply()).to.be.equal(0);

            await registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            });

            const account = await registry.accounts(user1);

            expect(await yct.totalSupply()).to.be.equal(ethers.parseUnits("1", 18));
            expect(await yct.balanceOf(account)).to.be.equal(ethers.parseUnits("1", 18));
        });

        it("Should transfer USDC to the best vault for the new account", async function () {
            const balance0 = await usdc.balanceOf(vault2);
            const shares = await vault2.previewDeposit(ethers.parseUnits("1000", 6));

            await registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            });

            const account = await registry.accounts(user1);

            const balance1 = await usdc.balanceOf(vault2);

            expect(await usdc.balanceOf(user1)).to.be.equal(ethers.parseUnits("9000", 6));
            expect(balance1 - balance0).to.be.equal(ethers.parseUnits("1000", 6));
            expect(await vault2.balanceOf(account)).to.be.equal(shares);
        });

        it("Should emit a AccountCreated event", async function () {
            await expect(registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            })).to.emit(registry, "AccountCreated").withArgs(user1, strategy, ethers.parseUnits("1000", 6), ethers.parseEther("0.001"));
        });

        it("Only an account with allowed strategy can be created", async function () {
            const strategy2 = await ethers.deployContract("YcStrategy", [ "Strategy 2", [] ]);

            await expect(registry.createAccount(strategy2, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            })).to.be.revertedWithCustomError(registry, "NotAllowedStrategy");
        });

        it("Only one account per user can be created", async function () {
            await registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            });
            
            await expect(registry.createAccount(strategy, ethers.parseUnits("1000", 6), 86400, {
                value: ethers.parseEther("0.001")
            })).to.be.revertedWithCustomError(registry, "AccountAlreadyExists");
        });
    });

    describe("updateStrategyVaultsNetAPY", () => {
        beforeEach(async () => {
            ({ user1, user2, bot, usdc, registry, yct, strategy, vault1, vault2 } = await setupWithAuthorizedBot());
        });

        it("Should update vaults net APYs for a strategy", async function () {
            expect(await strategy.vaults(vault1)).to.be.equal(8e4);
            expect(await strategy.vaults(vault2)).to.be.equal(85e3);

            await registry.connect(bot).updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                75e3, // 7,5 % net APY
                8e3,  // 8 % net APY
            ]);

            expect(await strategy.vaults(vault1)).to.be.equal(75e3);
            expect(await strategy.vaults(vault2)).to.be.equal(8e3);
        });
        
        it("Should emit a StrategyNetAPYsUpdated event", async function () {
            await expect(registry.connect(bot).updateStrategyVaultsNetAPY(strategy,[
                vault1,
                vault2
            ], [
                75e3, // 7,5 % net APY
                8e3,  // 8 % net APY
            ])).to.emit(registry, "StrategyNetAPYsUpdated").withArgs(bot, strategy);
        });
        
        it("Only bot could update vaults net APYs for a strategy", async function () {
            await expect(registry.updateStrategyVaultsNetAPY(strategy, [
                vault1,
                vault2
            ], [
                8e4,  // 8 % net APY
                85e3, // 8,5 % net APY
            ])).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
        });
    });
});
