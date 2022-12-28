require("@nomicfoundation/hardhat-toolbox");

const fs = require("fs");
const keyData = fs.readFileSync("./p-key.txt", {
    encoding: "utf-8",
    flag: "r"
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    paths: {artifacts: "./src/artifacts"},
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/25dc0faf706e414c840be5c220004aa3`,
            accounts: [keyData]
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`,
            accounts: [keyData]
        },
        goerli:{
            url: `https://goerli.infura.io/v3/25dc0faf706e414c840be5c220004aa3`,
            accounts: [keyData]
        }
    },
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};
