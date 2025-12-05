import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setup() {
    const usdc = await ethers.deployContract("MockUSDC");
    const usdcAddress = await usdc.getAddress();

    const [user1, user2] = await ethers.getSigners();
    await usdc.faucet(user1.address, ethers.parseUnits("1000", 6)); // 1 000 USDC
    await usdc.faucet(user2.address, ethers.parseUnits("500", 6)); // 500 USDC

    const managementFee = 10_000_000_000_000_000n; // 1e16 => 1 %
    const performanceFee = 150_000_000_000_000_000n; // 15e16 => 15 %
    const vault = await ethers.deployContract("MockMorphoVault", ["Mock Morpho Vault", "MMV", usdcAddress, managementFee, performanceFee]);
    await vault.getAddress();

    return {usdc, user1, user2, vault};
}

async function setupWithDeposits() {
    ({ usdc, user1, user2, vault } = await setup());
    
    await usdc.approve(vault.getAddress(), ethers.parseUnits("1000", 6));
    await vault.deposit(ethers.parseUnits("1000", 6), user1.address);

    await usdc.connect(user2).approve(vault.getAddress(), ethers.parseUnits("500", 6));
    await vault.connect(user2).deposit(ethers.parseUnits("500", 6), user2.address);

    return {usdc, user1, user2, vault};
}

async function setupWithDepositsAndIncAssets() {
    ({ usdc, user1, user2, vault } = await setupWithDeposits());
    
    await vault.incAssets(90_000_000); // +6%

    await usdc.faucet(user2.address, ethers.parseUnits("250", 6));
    await usdc.connect(user2).approve(vault.getAddress(), ethers.parseUnits("250", 6));
    await vault.connect(user2).deposit(ethers.parseUnits("250", 6), user2.address);

    return {usdc, user1, user2, vault};
}

let usdc: any;
let user1: any;
let user2: any;
let vault: any;

describe("MockMorphoVault", function () {
    describe("deposit", function () {
        beforeEach(async () => {
            ({ usdc, user1, user2, vault } = await setup());
        });

        it("Should transfer USDC when calling the deposit() function", async () => {
            expect(await usdc.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(0);

            await usdc.approve(vault.getAddress(), ethers.parseUnits("1000", 6));
            await vault.deposit(ethers.parseUnits("1000", 6), user1.address);

            expect(await usdc.balanceOf(user1.address)).to.equal(0);
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1000", 6));
        });

        it("Should update data when calling the deposit() function", async () => {
            expect(await vault.totalCapital()).to.equal(0);
            expect(await vault._totalAssets()).to.equal(0);
            expect(await vault.totalSupply()).to.equal(0);
            expect(await vault.balanceOf(user1.address)).to.equal(0);
            expect(await vault.balanceOf(user2.address)).to.equal(0);

            await usdc.approve(vault.getAddress(), ethers.parseUnits("1000", 6));
            await vault.deposit(ethers.parseUnits("1000", 6), user1.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(0);

            await usdc.connect(user2).approve(vault.getAddress(), ethers.parseUnits("500", 6));
            await vault.connect(user2).deposit(ethers.parseUnits("500", 6), user2.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));
        });
    });

    describe("withdraw", function () {
        beforeEach(async () => {
            ({ usdc, user1, user2, vault } = await setupWithDeposits());
        });

        it("Should transfer USDC when calling the withdraw() function", async () => {
            expect(await usdc.balanceOf(user1.address)).to.equal(0);
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1500", 6));

            await vault.withdraw(ethers.parseUnits("250", 6), user1.address, user1.address);

            expect(await usdc.balanceOf(user1.address)).to.equal(ethers.parseUnits("250", 6));
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1250", 6));
        });

        it("Should update data when calling the withdraw() function", async () => {
            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.withdraw(ethers.parseUnits("500", 6), user1.address, user1.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.connect(user2).withdraw(ethers.parseUnits("250", 6), user2.address, user2.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("250", 6));
        });
    });

    describe("withdraw", function () {
        beforeEach(async () => {
            ({ usdc, user1, user2, vault } = await setupWithDeposits());
        });

        it("Should transfer USDC when calling the withdraw() function", async () => {
            expect(await usdc.balanceOf(user1.address)).to.equal(0);
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1500", 6));

            await vault.withdraw(ethers.parseUnits("250", 6), user1.address, user1.address);

            expect(await usdc.balanceOf(user1.address)).to.equal(ethers.parseUnits("250", 6));
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1250", 6));
        });

        it("Should update data when calling the withdraw() function", async () => {
            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.withdraw(ethers.parseUnits("500", 6), user1.address, user1.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.connect(user2).withdraw(ethers.parseUnits("250", 6), user2.address, user2.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("750", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("250", 6));
        });
    });

    describe("redeem", function () {
        beforeEach(async () => {
            ({ usdc, user1, user2, vault } = await setupWithDeposits());
        });

        it("Should transfer USDC when calling the redeem() function", async () => {
            expect(await usdc.balanceOf(user1.address)).to.equal(0);
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1500", 6));

            await vault.redeem(ethers.parseUnits("750", 6), user1.address, user1.address);

            expect(await usdc.balanceOf(user1.address)).to.equal(ethers.parseUnits("750", 6));
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("750", 6));
        });

        it("Should update data when calling the redeem() function", async () => {
            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("1500", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.redeem(ethers.parseUnits("1000", 6), user1.address, user1.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("500", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("500", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(0);
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("500", 6));

            await vault.connect(user2).redeem(ethers.parseUnits("125", 6), user2.address, user2.address);

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("375", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("375", 6));
            expect(await vault.totalSupply()).to.equal(ethers.parseUnits("375", 6));
            expect(await vault.balanceOf(user1.address)).to.equal(0);
            expect(await vault.balanceOf(user2.address)).to.equal(ethers.parseUnits("375", 6));
        });
    });

    describe("incAssets", function () {
        beforeEach(async () => {
            ({ usdc, user1, user2, vault } = await setupWithDepositsAndIncAssets());
        });

        it("Should transfer USDC with interest minus fees when calling the redeem() function", async () => {
            expect(await usdc.balanceOf(user1)).to.equal(0);
            expect(await usdc.balanceOf(vault.getAddress())).to.equal(ethers.parseUnits("1840", 6));

            // total assets = 1 500 + 90 + 250 = 1 840
            // assets = 1 000 * 1840 / 1735,849056 ~= 1 060
            // capital part = 1 000 * 1 750 / 1 735,849056 ~= 1 008,152174
            // interest = 1 060 - 1 008,152174 = 51,847826
            // management fees = 51,847826 * (0,15 + 0,01) = 8,295652 
            // net assets = 1 060 - 8.295652  = 1 051,704348

            await vault.redeem(ethers.parseUnits("1000", 6), user1.address, user1.address);

            expect(await usdc.balanceOf(user1.address)).to.be.closeTo(1_051_704_348, 1);
            expect(await usdc.balanceOf(vault.getAddress())).to.be.closeTo(788_295_652, 1);
        });

        it("Should update data when calling the redeem() function", async () => {
            // total capital (t0) = 1 500 + 250 = 1 750
            // total supply (t0) = 1 500 + 250 * 1 500 / 1 590 ~= 1 735,849056

            expect(await vault.totalCapital()).to.equal(ethers.parseUnits("1750", 6));
            expect(await vault._totalAssets()).to.equal(ethers.parseUnits("1840", 6));
            expect(await vault.totalSupply()).to.equal(1_735_849_056);
            expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000", 6));

            // total assets (t0) = 1 500 + 90 + 250 = 1 840
            // assets = 1 000 * 1 840 / 1 735,849056 ~= 1 060
            // capital part = 1 000 * 1 750 / 1 735,849056 ~= 1 008,152174
            // interest = 1 060 - 1 008,152174 = 51,847826
            // management fees = 51,847826 * (0,15 + 0,01) = 8,295652 
            // net assets = 1 060 - 8,295652  = 1 051,704348

            await vault.redeem(ethers.parseUnits("1000", 6), user1.address, user1.address);

            // total capital (t1) = 1 750 - 1 008,152174 = 741,847826
            // total supply (t1) = 1 735,849056 - 1 000 = 735,849056
            // total assets (t1) = 1 840 - 1 060 + 8,295652 = 788,295652

            expect(await vault.totalCapital()).to.equal(741_847_826);
            expect(await vault._totalAssets()).to.be.closeTo(788_295_652, 1);
            expect(await vault.totalSupply()).to.equal(735_849_056);
            expect(await vault.balanceOf(user1.address)).to.equal(0);
        });
    });
});
