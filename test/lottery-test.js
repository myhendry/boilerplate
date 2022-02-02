describe("Lottery", function () {
  let lottery;
  let admin;
  let player1;
  let player2;
  let result;

  before(async () => {
    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
    await lottery.deployed();
    [admin, player1, player2] = await ethers.getSigners();
    // await simpleLottery.connect(player1).enter({
    //   value: ethers.utils.parseEther("0.01"),
    // });
  });

  describe.only("Return Lottery Results", async function () {
    it("Should return lottery", async function () {
      console.log("fee", await lottery.fee());
      console.log("usdEntryFee", await lottery.usdEntryFee());
      //todo function call to a non-contract account
      console.log("getEntranceFee", await lottery.getEntranceFee());
      console.log("randomness", await lottery.randomness());
    });
  });
});
