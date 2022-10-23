require("@nomicfoundation/hardhat-toolbox");

const PROJECT_ID = "25dc0faf706e414c840be5c220004aa3";

const fs = require("fs");
const keyData = fs.readFileSync("./p-key.txt", {
  encoding: "utf-8",
  flag: "r",
});
console.log(keyData)

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID}`,
      accounts: [keyData],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${PROJECT_ID}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
