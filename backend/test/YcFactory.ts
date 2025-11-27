import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setup() {
    const [user1, user2] = await ethers.getSigners();

    const factory = await ethers.deployContract("YcFactory");

    const usdc = await ethers.deployContract("MockUSDC");

    const strategy = await ethers.deployContract("YcStrategy", [ "Strategy 1", [] ]);

    return { user1, user2, factory, usdc, strategy };
}

let user1: any;
let user2: any;
let factory: any;
let usdc: any;
let strategy: any;

describe("YcFactory", () => {

    describe("createAccount", () => {

        beforeEach(async () => {
            ({ user1, user2, factory, usdc, strategy } = await setup());
        });

        it("Should create an account", async function () {
            await factory.createAccount(usdc, strategy, user1);
        });

        it("Should emit a AccountCreated event", async function () {
            await expect(factory.createAccount(usdc, strategy, user1)).to.emit(factory, "AccountCreated");
        });

        it("Only owner could create an account", async function () {
            await expect(factory.connect(user2).createAccount(usdc, strategy, user1)).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
        });
    });
});
