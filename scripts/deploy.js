const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const tokenSupply = hre.ethers.utils.parseEther("1000");
  const network = await hre.network.name;

  let price_feed_address;
  let vrf_coordinator;
  let link_token;
  const keyhash =
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
  const fee = 1000000000000000;

  if (network === "rinkeby") {
    // On Rinkeby
    price_feed_address = "0x8a753747a1fa494ec906ce90e9f37563a8af630e";
    vrf_coordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
    link_token = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  } else {
    // Deploy mocks
    const MockV3Aggregator = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockAggregator = await MockV3Aggregator.deploy(8, 200000000000);
    await mockAggregator.deployed();
    price_feed_address = mockAggregator.address;
    console.log("Mock price feed address: " + price_feed_address);

    const MockLinkToken = await ethers.getContractFactory("LinkToken");
    const mockLinkToken = await MockLinkToken.deploy();
    await mockLinkToken.deployed();
    link_token = mockLinkToken.address;
    console.log("Mock link token address: " + link_token);

    const MockVRFCoordinator = await ethers.getContractFactory(
      "MockVRFCoordinator"
    );
    const mockVRFCoordinator = await MockVRFCoordinator.deploy(link_token);
    await mockVRFCoordinator.deployed();
    vrf_coordinator = mockVRFCoordinator.address;
    console.log("Mock vrf coordinator address: " + vrf_coordinator);
  }

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    price_feed_address,
    vrf_coordinator,
    link_token,
    fee,
    keyhash
  );
  await lottery.deployed();

  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  // await greeter.deployed();

  // const MemoryToken = await hre.ethers.getContractFactory("MemoryToken");
  // const memoryToken = await MemoryToken.deploy("HL");
  // await memoryToken.deployed();

  // const FundMe = await hre.ethers.getContractFactory("FundMe");
  // const fundMe = await FundMe.deploy();
  // await fundMe.deployed();

  // const HToken = await hre.ethers.getContractFactory("HToken");
  // const hToken = await HToken.deploy(tokenSupply);
  // await hToken.deployed();

  // const SimpleLottery = await hre.ethers.getContractFactory("SimpleLottery");
  // const simpleLottery = await SimpleLottery.deploy();
  // await simpleLottery.deployed();

  console.log(`Lottery Contract deployed to: ${lottery.address}`);
  // console.log(`Greeter Contract deployed to: ${greeter.address}`);
  // console.log(`MemoryToken Contract deployed to: ${memoryToken.address}`);
  // console.log(`FundMe Contract deployed to: ${fundMe.address}`);
  // console.log(`HToken Contract deployed to: ${hToken.address}`);
  // console.log(`SimpleLottery Contract deployed to: ${simpleLottery.address}`);

  const data = {
    lotteryAddress: lottery.address,
    lotteryAbi: JSON.parse(lottery.interface.format("json")),
    // greeterAddress: greeter.address,
    // greeterAbi: JSON.parse(greeter.interface.format("json")),
    // memoryTokenAddress: memoryToken.address,
    // memoryTokenAbi: JSON.parse(memoryToken.interface.format("json")),
    // fundMeAddress: fundMe.address,
    // fundMeAbi: JSON.parse(fundMe.interface.format("json")),
    // hTokenAddress: hToken.address,
    // hTokenAbi: JSON.parse(fundMe.interface.format("json")),
    // simpleLotteryAddress: simpleLottery.address,
    // simpleLotteryAbi: JSON.parse(simpleLottery.interface.format("json")),
  };
  fs.writeFileSync("eth/Contracts.json", JSON.stringify(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
