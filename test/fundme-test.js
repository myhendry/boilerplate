describe("FundMe", function () {
  let fundme;
  let admin;
  let player1;
  let player2;
  let result;

  before(async () => {
    const FundMe = await ethers.getContractFactory("FundMe");
    fundme = await FundMe.deploy();
    await fundme.deployed();
    [admin, player1, player2] = await ethers.getSigners();
    // await simpleLottery.connect(player1).enter({
    //   value: ethers.utils.parseEther("0.01"),
    // });
  });

  describe("Return FundMe Results", async function () {
    it("Should return fundme", async function () {
      //todo Error: Transaction reverted: function call to a non-contract account
      //console.log("getversion", await fundme.getVersion());
    });
  });
});
