import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setup() {
    const [user1, user2] = await ethers.getSigners();

    const token = await ethers.deployContract("YcToken");

    return { user1, user2, token };
}

let user1: any;
let user2: any;
let token: any;

describe("YcToken", () => {

    describe("mint", () => {

        it("Should mint", async function () {
            ({ user1, user2, token } = await setup());

            expect(await token.balanceOf(user2)).to.be.equal(0);

            await token.mint(user2, ethers.parseUnits("1", 18));

            expect(await token.balanceOf(user2)).to.be.equal(ethers.parseUnits("1", 18));
        });

        it("Should emit a Transfer event", async function () {
            await expect(token.mint(user2, ethers.parseUnits("1", 18))).to.emit(token, "Transfer").withArgs("0x0000000000000000000000000000000000000000", user2, ethers.parseUnits("1", 18));
        });

        it("Only owner could mint", async function () {
            await expect(token.connect(user2).mint(user2, ethers.parseUnits("1", 18))).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });
});
