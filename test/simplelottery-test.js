const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Lottery", function () {
  let simpleLottery;
  let admin;
  let player1;
  let player2;
  let result;

  before(async () => {
    const SimpleLottery = await ethers.getContractFactory("SimpleLottery");
    simpleLottery = await SimpleLottery.deploy();

    [admin, player1, player2] = await ethers.getSigners();

    await simpleLottery.connect(player1).enter({
      value: ethers.utils.parseEther("0.01"),
    });
    await simpleLottery.connect(player2).enter({
      value: ethers.utils.parseEther("0.01"),
    });
  });

  describe("Return SimpleLottery Results", function () {
    it("Should return the owner", async function () {
      //console.log("random", await simpleLottery.getRandomNumber());
      expect(await simpleLottery.owner()).to.equal(admin.address);
    });

    it("Should return 2 players", async function () {
      expect((await simpleLottery.getPlayers()).length).to.equal(2);
    });

    it("Should pick Winner", async function () {
      await simpleLottery.connect(admin).pickWinner();
    });
  });
});
