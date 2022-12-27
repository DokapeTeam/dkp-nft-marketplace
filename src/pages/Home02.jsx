import React, {useEffect, useState} from 'react';
import Header from '../components/header/Header';
import Slider02 from '../components/slider/Slider02';
import dataSlider2 from '../assets/fake-data/dataSlider2';
import Create from '../components/layouts/home02/Create';
import dataCreate from '../assets/fake-data/dataCreate'
import LatestCollections from '../components/layouts/home02/LatestCollections';
import dataCollections from '../assets/fake-data/dataCollections'
import HotCollections from '../components/layouts/home02/HotCollections';
import dataHotCollection from '../assets/fake-data/dataHotCollection';
import PopularCollection from '../components/layouts/home02/PopularCollection';
import dataPopularCollection from '../assets/fake-data/dataPopularCollection';
import FooterStyle2 from '../components/footer/FooterStyle2';
import {ethers} from "ethers";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import axios from "axios";
import {marketAddress, nftAddress} from "../config";
import LiveAutions from "../components/layouts/item/LiveAutions";

const Home02 = () => {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    let items = []

    useEffect(() => {
        loadNFTs()
    }, [])

    const loadNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, provider)
        const data = await marketContract.fetchMarketTokens()
        console.log(data)
        const currencyRateResponse = await axios.get('https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
        const usdCurrencyRate = currencyRateResponse.data['price']
        items = await Promise.all(data.map(async item => {
            const tokenUri = await tokenContract.tokenURI(item.tokenId)
            // we want get the token metadata - json
            const meta = await axios.get(tokenUri)
            console.log(tokenUri, "token uri")
            let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
            return {
                price,
                tokenId: item.tokenId.toNumber(),
                seller: item.seller,
                owner: item.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                usdPrice: price * usdCurrencyRate
            }
        }))
        setNFts(items)
    }

    return <div className='home-2'>
        <Header/>
        <Slider02 data={dataSlider2}/>
        {/*<BestSeller data={dataBestSeller}/>*/}
        <LiveAutions data={nfts}/>
        <Create data={dataCreate}/>
        <LatestCollections data={dataCollections}/>
        <HotCollections data={dataHotCollection}/>
        <PopularCollection data={dataPopularCollection}/>
        {/*<Newsletters/>*/}
        <FooterStyle2/>
    </div>;
};

export default Home02;
