const fs = require('fs')
const {ethers} = require("hardhat");

async function main() {

    const accounts = await ethers.getSigners()

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i]
        console.log(account.address)
    }

    const DKPMarketplace = await ethers.getContractFactory("DKPMarketplace");
    const marketplace = await DKPMarketplace.deploy();
    await marketplace.deployed();
    const marketAddress = marketplace.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    let config = `
  export const marketAddress = '${marketAddress}'
  export const nftAddress = '${nftAddress}'`

    let data = JSON.stringify(config)
    fs.writeFileSync('src/config.js', JSON.parse(data))


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
