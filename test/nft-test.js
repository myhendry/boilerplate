const { expect } = require("chai");
const { assert } = require("console");
const { ethers } = require("hardhat");

describe("MemoryToken", function () {
  let memoryToken;
  let admin;
  let buyer;
  let result;
  const img1 = "http://img1.jpeg";
  const img2 = "http://img2.jpeg";
  const img3 = "http://img3.jpeg";

  before(async () => {
    const MemoryToken = await ethers.getContractFactory("MemoryToken");
    memoryToken = await MemoryToken.deploy("Lim");

    const accounts = await ethers.getSigners();
    admin = accounts[0].address;
    buyer = accounts[1].address;

    await memoryToken.mint(admin, img1);
    await memoryToken.mint(admin, img2);
    //await memoryToken.mint(admin, img3);
  });

  describe("Deployment", function () {
    it("deploys successfully", async function () {
      expect(memoryToken.address).to.not.equal(0x0);
      expect(memoryToken.address).to.not.equal("");
      expect(memoryToken.address).to.not.equal(null);
      expect(memoryToken.address).to.not.equal(undefined);
    });

    it("should return NFT name", async function () {
      expect(await memoryToken.name()).to.equal("Hendry");
    });

    it("should return NFT symbol", async function () {
      expect(await memoryToken.symbol()).to.equal("HL");
    });

    it("should set nick name to High", async function () {
      await memoryToken.setName("High");
      expect(await memoryToken.nickName()).to.equal("High");
    });
  });

  describe("Token Distribution", function () {
    it("mints NFT Tokens", async function () {
      // it should increase the total supply
      result = await memoryToken.totalSupply();
      expect(result).to.equal("2");
    });

    it("increments owner's balances", async function () {
      result = await memoryToken.balanceOf(admin);
      expect(result).to.equal("2");
    });

    it("token should belong to owner", async function () {
      result = await memoryToken.ownerOf("1");
      expect(result).to.equal(admin);
    });

    it("Token URI Correct", async function () {
      result = await memoryToken.tokenURI("1");
      expect(result).to.equal(img1);
    });
  });
});
