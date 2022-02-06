const { ethers } = require("hardhat");

describe("Lottery (Local)", function () {
  let lottery;
  let admin;
  let player1;
  let player2;
  let price_feed_address;
  let vrf_coordinator;
  let link_token;
  let mockAggregator;
  let mockLinkToken;
  let mockVRFCoordinator;
  const keyhash =
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
  const fee = 1000000000000000;

  before(async () => {
    [admin, player1, player2, player3] = await ethers.getSigners();
    //console.log(admin.address, player1.address, player2.address);

    // Deploy mocks
    const MockV3Aggregator = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    mockAggregator = await MockV3Aggregator.deploy(8, 200000000000);
    await mockAggregator.deployed();
    price_feed_address = mockAggregator.address;
    console.log("Mock price feed address: " + price_feed_address);

    const MockLinkToken = await ethers.getContractFactory("LinkToken");
    mockLinkToken = await MockLinkToken.deploy();
    await mockLinkToken.deployed();
    link_token = mockLinkToken.address;
    console.log("Mock link token address: " + link_token);

    const MockVRFCoordinator = await ethers.getContractFactory(
      "MockVRFCoordinator"
    );
    mockVRFCoordinator = await MockVRFCoordinator.deploy(link_token);
    await mockVRFCoordinator.deployed();
    vrf_coordinator = mockVRFCoordinator.address;
    console.log("Mock vrf coordinator address: " + vrf_coordinator);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(
      price_feed_address,
      vrf_coordinator,
      link_token,
      fee,
      keyhash
    );
    await lottery.deployed();
  });

  describe("Return Lottery Results", async function () {
    it("Should return lottery", async function () {
      console.log("fee", await lottery.fee());
      console.log("usdEntryFee", await lottery.usdEntranceFee());
      console.log(
        "getEntranceFee",
        await lottery.connect(admin).getEntranceFee()
      );

      await lottery.connect(admin).startLottery();
      console.log("lottery_state", await lottery.lotteryState());

      // await lottery.connect(player1).enter({
      //   value: ethers.utils.parseEther("0.02"),
      // });

      // await lottery.connect(player2).enter({
      //   value: ethers.utils.parseEther("0.02"),
      // });

      await lottery.connect(player1).enter({
        value: ethers.utils.parseUnits("1", 17),
      });

      await lottery.connect(player2).enter({
        value: ethers.utils.parseUnits("1", 17),
      });

      await lottery.connect(player3).enter({
        value: ethers.utils.parseUnits("1", 17),
      });

      console.log("players", await lottery.getPlayers());

      const balance1 = await ethers.provider.getBalance(lottery.address);
      const ether_balance_lottery_start = ethers.utils.formatEther(balance1);
      console.log("ether_balance_lottery_start", ether_balance_lottery_start);

      await mockLinkToken.transfer(lottery.address, 1000000000000000);

      const tx = await lottery.endLottery();
      const receipt = await tx.wait();
      console.log("lottery_state", await lottery.lotteryState());

      const requestId = receipt.events[0].topics[1];
      console.log("requestId", requestId);

      const STATIC_RNG = 351;
      // 346
      mockVRFCoordinator.callBackWithRandomness(
        requestId,
        STATIC_RNG,
        lottery.address
      );

      const latestRandom = await lottery.latestRandomNumber();
      console.log("latestRandom", latestRandom);

      const lotteryWinner = await lottery.latestWinner();
      console.log("lotteryWinner", lotteryWinner);

      const balance2 = await ethers.provider.getBalance(lottery.address);
      const ether_balance_lottery_end = ethers.utils.formatEther(balance2);
      console.log("ether_balance_lottery_end", ether_balance_lottery_end);

      const account_balance_player1 = await ethers.provider.getBalance(
        player1.address
      );
      const ether_balance_player1 = ethers.utils.formatEther(
        account_balance_player1
      );
      console.log("ether_balance_player1", ether_balance_player1);
    });
  });
});
