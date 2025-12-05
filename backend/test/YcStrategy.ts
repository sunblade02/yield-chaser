import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setupWithNoVault() {
    const [user1, user2] = await ethers.getSigners();

    const usdc = await ethers.deployContract("MockUSDC");

    const strategy = await ethers.deployContract("YcStrategy", [ "Strategy 1", [] ]);

    const managementFeeVault1 = ethers.parseUnits("1", 16); // 1e16 => 1 %
    const performanceFeeVault1 = ethers.parseUnits("10", 16); // 10e16 => 10 %
    const vault1 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 1", "MMV1", usdc, managementFeeVault1, performanceFeeVault1 ]);

    return { user1, user2, strategy, vault1, usdc };
}

async function setupWithVaults() {
    ({ user1, user2, strategy, vault1, usdc } = await setupWithNoVault());

    const managementFeeVault2 = ethers.parseUnits("0.7", 16); // 7e15 => 0,7 %
    const performanceFeeVault2 = ethers.parseUnits("12", 16); // 12e16 => 14 %
    const vault2 = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault 2", "MMV2", usdc, managementFeeVault2, performanceFeeVault2 ]);

    await strategy.addVault(vault1);
    await strategy.addVault(vault2);

    return { user1, user2, strategy, vault1, vault2 };
}

let user1: any;
let user2: any;
let usdc: any;
let strategy: any;
let vault1: any;
let vault2: any;

describe("YcStrategy", () => {

    describe("setName", () => {

        beforeEach(async () => {
            ({ user1, user2, strategy, vault1 } = await setupWithNoVault());
        });

        it("Should set name", async () => {
            expect(await strategy.name()).to.be.equal("Strategy 1");

            await strategy.setName("Strategy 2");

            expect(await strategy.name()).to.be.equal("Strategy 2");
        });

        it("Should emit a NameSet event", async () => {
            await expect(strategy.setName("Strategy 2")).to.emit(strategy, "NameSet").withArgs("Strategy 1", "Strategy 2");
        });

        it("Only owner could set name", async () => {
            await expect(strategy.connect(user2).setName("Strategy 2")).to.be.revertedWithCustomError(strategy, "OwnableUnauthorizedAccount");
        });
    });

    describe("addVault", () => {

        beforeEach(async () => {
            ({ user1, user2, strategy, vault1 } = await setupWithNoVault());
        });

        it("Should add a vault", async () => {
            await strategy.addVault(vault1);

            expect(await strategy.vaultsArray(0)).to.be.equal(vault1);
        });

        it("Should emit a VaultAdded event", async () => {
            await expect(strategy.addVault(vault1)).to.emit(strategy, "VaultAdded").withArgs(vault1);
        });

        it("Only owner could add a vault", async () => {
            await expect(strategy.connect(user2).addVault(vault1)).to.be.revertedWithCustomError(strategy, "OwnableUnauthorizedAccount");
        });
    });

    describe("updateVaultsNetAPY", () => {

        beforeEach(async () => {
            ({ user1, user2, strategy, vault1, vault2 } = await setupWithVaults());
        });

        it("Should update vaults net APY", async () => {
            expect(await strategy.vaults(vault1)).to.be.equal(0);
            expect(await strategy.vaults(vault2)).to.be.equal(0);

            await strategy.updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                8e4,  // 8 % net APY
                85e3, // 8,5 % net APY
            ]);

            expect(await strategy.vaults(vault1)).to.be.equal(8e4);
            expect(await strategy.vaults(vault2)).to.be.equal(85e3);
        });

        it("Should emit a VaultsNetAPYUpdated event", async () => {
            await expect(strategy.updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                8e4,  // 8 % net APY
                85e3, // 8,5 % net APY
            ])).to.emit(strategy, "VaultsNetAPYUpdated").withArgs([
                vault1,
                vault2
            ], [
                8e4,
                85e3,
            ]);
        });

        it("Only owner could update vaults net APY", async () => {
            await expect(strategy.connect(user2).updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                8e4,  // 8 % net APY
                85e3, // 8,5 % net APY
            ])).to.be.revertedWithCustomError(strategy, "OwnableUnauthorizedAccount");
        });
    });

    describe("getBestVault", () => {

        beforeEach(async () => {
            ({ user1, user2, strategy, vault1, vault2 } = await setupWithVaults());
        });

        it("Should return the vault with the highest yield", async () => {
            await strategy.updateVaultsNetAPY([
                vault1,
                vault2
            ], [
                85e3,   // 8,5 % net APY
                8e4,    // 8 % net APY
            ]);

            expect(await strategy.getBestVault()).to.be.equal(vault1);
        });
    });

    describe("getVaults", () => {

        beforeEach(async () => {
            ({ user1, user2, strategy, vault1, vault2 } = await setupWithVaults());
        });

        it("Should return the vaults in the strategy", async () => {
            const vaults = await strategy.getVaults();

            expect(vaults.length).to.be.equal(2);
            if (vaults.length === 2) {
                expect(vaults[0]).to.be.equal(vault1);
                expect(vaults[1]).to.be.equal(vault2);
            }
        });
    });
});
