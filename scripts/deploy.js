// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();

  const MemoryToken = await hre.ethers.getContractFactory("MemoryToken");
  const memoryToken = await MemoryToken.deploy("HL");
  await memoryToken.deployed();

  const FundMe = await hre.ethers.getContractFactory("FundMe");
  const fundMe = await FundMe.deploy();
  await fundMe.deployed();

  console.log(`Greeter Contract deployed to: ${greeter.address}`);
  console.log(`MemoryToken Contract deployed to: ${memoryToken.address}`);
  console.log(`FundMe Contract deployed to: ${fundMe.address}`);
  const data = {
    greeterAddress: greeter.address,
    greeterAbi: JSON.parse(greeter.interface.format("json")),
    memoryTokenAddress: memoryToken.address,
    memoryTokenAbi: JSON.parse(memoryToken.interface.format("json")),
    fundMeAddress: fundMe.address,
    fundMeAbi: JSON.parse(fundMe.interface.format("json")),
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
