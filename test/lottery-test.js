const { ethers } = require("hardhat");

const abi = require("../LinkTokenABI.json");

describe.only("Lottery (Rinkeby)", function () {
  let lottery;
  let admin;
  let player1;
  let player2;
  let result;
  let signer;

  signer = new ethers.Wallet(process.env.PRIVATE_KEY_RINKEBY, ethers.provider);

  let tx;

  const price_feed_address = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
  const vrf_coordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
  const link_token = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  const keyhash =
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
  const fee = 1000000000000000;

  before(async () => {
    [admin, player1, player2] = await ethers.getSigners();
    //console.log(admin.address, player1.address, player2.address);

    //const signer2 = ethers.provider.getSigner();
  });

  describe("Return Lottery Results", async function () {
    it("Should return lottery", async function () {
      const Lottery = await ethers.getContractFactory("Lottery");
      lottery = await Lottery.deploy(
        price_feed_address,
        vrf_coordinator,
        link_token,
        fee,
        keyhash
      );
      await lottery.deployed();
      console.log("lottery address", lottery.address);

      // const lottery = await hre.ethers.getContractAt(
      //   "Lottery",
      //   "0xA1D8374041B1293E36e390FB3633f99C263A3626"
      // );

      console.log("fee", await lottery.fee());
      console.log("usdEntryFee", await lottery.usdEntranceFee());
      console.log(
        "getEntranceFee",
        await lottery.connect(admin).getEntranceFee()
      );

      // todo not working
      // const LinkToken = await hre.ethers.getContractAt(
      //   "LinkToken",
      //   "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
      // );
      // tx = await LinkToken.connect(admin).transfer(
      //   lottery.address,
      //   1000000000000000
      // );
      // await tx.wait();

      const LinkToken = new ethers.Contract(link_token, abi, signer);
      await LinkToken.connect(admin).transfer(
        lottery.address,
        1000000000000000
      );
      //await tx.wait();

      tx = await lottery.connect(admin).startLottery();
      await tx.wait();
      console.log("lottery_state", await lottery.lotteryState());

      // tx = await lottery.connect(player1).enter({
      //   value: ethers.utils.parseEther("0.02"),
      // });
      // await tx.wait();

      // tx = await lottery.connect(player2).enter({
      //   value: ethers.utils.parseEther("0.02"),
      // });
      // await tx.wait();

      // tx = await lottery.connect(player2).enter({
      //   value: ethers.utils.parseUnits("1", 17),
      // });
      // await tx.wait();

      // await lottery.connect(player2).enter({
      //   value: ethers.utils.parseUnits("1", 17),
      // });

      // tx = await lottery
      //   .connect(player1)
      //   .enter((overrides = { value: ethers.utils.parseUnits("1", 17) }));
      // await tx.wait();

      tx = await lottery
        .connect(player2)
        .enter((overrides = { value: ethers.utils.parseUnits("1", 17) }));
      await tx.wait();

      console.log("players", await lottery.getPlayers());

      const balance1 = await ethers.provider.getBalance(lottery.address);
      const ether_balance_lottery_start = ethers.utils.formatEther(balance1);
      console.log("ether_balance_lottery_start", ether_balance_lottery_start);

      const link_balance = await lottery.getLinkBalance();
      console.log("link_balance", link_balance);

      tx = await lottery.endLottery();
      const receipt = await tx.wait();
      console.log("receipt", receipt);
      // const requestId = receipt.events[0].topics[1];
      // console.log("requestId", requestId);
      console.log("lottery_state", await lottery.lotteryState());

      const balance2 = await ethers.provider.getBalance(lottery.address);
      const ether_balance_lottery_end = ethers.utils.formatEther(balance2);
      console.log("ether_balance_lottery_end", ether_balance_lottery_end);
    });
  });
});
