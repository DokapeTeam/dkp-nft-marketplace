const fs = require('fs')
const {ethers} = require("hardhat");

async function main() {

    const DKPMarketplace = await ethers.getContractFactory("DKPMarketplace");
    const marketplace = await DKPMarketplace.deploy();
    await marketplace.deployed();
    const marketAddress = marketplace.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;
    // let listingPrice = await marketplace.getListingPrice();
    // listingPrice = listingPrice.toString();
    //
    // const auctionPrice = ethers.utils.parseUnits("100", "ether");
    //
    // await nft.mintToken("https-t1");
    // await nft.mintToken("https-t2");
    //
    // await marketplace.makeMarketItem(nftAddress, 1, auctionPrice, {
    //     value: listingPrice,
    // });
    // await marketplace.makeMarketItem(nftAddress, 2, auctionPrice, {
    //     value: listingPrice,
    // });
    //
    // const [_, buyerAddress] = await ethers.getSigners();
    //
    // await marketplace
    //     .connect(buyerAddress)
    //     .createMarketSale(nftAddress, 1, {value: auctionPrice});
    //
    // let items = await marketplace.fetchMarketTokens();
    //
    // items = await Promise.all(items.map(async (item) => {
    //     const tokenURI = await nft.tokenURI(item.tokenId)
    //
    //     return {
    //         price: item.price.toString(),
    //         tokenId: item.tokenId.toString(),
    //         seller: item.seller,
    //         owner: item.owner,
    //         tokenURI,
    //     };
    // }))
    //
    // console.log("items", items);


    let config = `
  export const marketAddress = '${marketAddress}'
  export const nftAddress = '${nftAddress}'`

    let data = JSON.stringify(config)
    fs.writeFileSync('config.js', JSON.parse(data))


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
