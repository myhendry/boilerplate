require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    //console.log('accounts', account.address);
    console.log("accounts", account);
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

const TESTNET_ACCOUNT_1 = process.env.TESTNET_ACCOUNT_1;
const TESTNET_ACCOUNT_2 = process.env.TESTNET_ACCOUNT_2;

module.exports = {
  // solidity: "0.8.0",
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.6.0",
      },
    ],
    // overrides: {
    //   "contracts/Lottery.sol": {
    //     version: "0.6.6",
    //     settings: {},
    //   },
    // },
  },
  networks: {
    rinkeby: {
      url: INFURA_RINKEBY_URL,
      accounts: [
        `0x${PRIVATE_KEY_RINKEBY}`,
        `0x${TESTNET_ACCOUNT_1}`,
        `0x${TESTNET_ACCOUNT_2}`,
      ],
      // timeout: 60000,
    },
    ropsten: {
      url: INFURA_ROPSTEN_URL,
      accounts: [
        `0x${PRIVATE_KEY_ROPSTEN}`,
        `0x${TESTNET_ACCOUNT_1}`,
        `0x${TESTNET_ACCOUNT_2}`,
      ],
      // timeout: 60000,
    },
  },
};
