require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const INFURA_RINKEBY_URL = process.env.INFURA_RINKEBY_URL;
const PRIVATE_KEY_RINKEBY = process.env.PRIVATE_KEY_RINKEBY;

const INFURA_ROPSTEN_URL = process.env.INFURA_ROPSTEN_URL;
const PRIVATE_KEY_ROPSTEN = process.env.PRIVATE_KEY_ROPSTEN;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: INFURA_RINKEBY_URL,
      accounts: [`0x${PRIVATE_KEY_RINKEBY}`],
    },
    ropsten: {
      url: INFURA_ROPSTEN_URL,
      accounts: [`0x${PRIVATE_KEY_ROPSTEN}`],
    },
  },
};
