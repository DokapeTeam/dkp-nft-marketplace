import React, {useEffect, useState} from 'react';
import Header from '../components/header/Header';
import Slider02 from '../components/slider/Slider02';
import dataSlider2 from '../assets/fake-data/dataSlider2';
import Create from '../components/layouts/home02/Create';
import dataCreate from '../assets/fake-data/dataCreate'
import FooterStyle2 from '../components/footer/FooterStyle2';
import {ethers} from "ethers";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import axios from "axios";
import {marketAddress, nftAddress} from "../config";
import PopularCollection from "../components/layouts/explore/PopularCollection";
import Web3Modal from "web3modal";
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "../firebase";

const Home = () => {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState(false)

    let items = []

    useEffect(() => {
        getUsers().then(users => {
            loadNFTs(users)
        })
    }, [])

    const getUsers = async () => {
        const response = await getDocs(collection(firestore, 'authors'))
        const users = response.docs.map((doc, _) => doc.data())
        if (users !== null) {
            return users
        }
    }
    const loadNFTs = async (users) => {
        try {
            setLoadingState(false)
            const provider = new ethers.providers.Web3Provider(
                window.ethereum
            )
            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
            const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, provider)
            const data = await marketContract.fetchMarketTokens()
            const currencyRateResponse = await axios.get('https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
            const usdCurrencyRate = currencyRateResponse.data['price']
            items = await Promise.all(data.map(async item => {
                const tokenUri = await tokenContract.tokenURI(item.tokenId)
                // we want get the token metadata - json
                const meta = await axios.get(tokenUri)
                let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
                let sellerInfo = users.find((user) => user.walletAddress === item.seller)
                return {
                    price,
                    tokenId: item.tokenId.toNumber(),
                    seller: item.seller,
                    owner: item.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                    usdPrice: price * usdCurrencyRate,
                    sold: item.sold,
                    category: item.category,
                    createdDate: item.dateMinted.toNumber(),
                    author: sellerInfo,
                    itemId: item.itemId.toNumber(),
                }
            }))
            setNFts(items)
            console.log(items)
            setLoadingState(true)
        } catch (e) {
            console.log(e)
            setLoadingState(true)
        }
    }

    async function buyNFT(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nftAddress, nft.itemId, {
            value: price
        })

        await transaction.wait()
        await loadNFTs()
    }

    return <div className='home-2'>
        <Header/>
        <Slider02 data={dataSlider2}/>
        <Create data={dataCreate}/>
        {/*<BestSeller data={dataBestSeller}/>*/}
        <PopularCollection data={nfts} onBuy={buyNFT} loaded={loadingState}/>
        {/*<LatestCollections data={dataCollections}/>*/}
        {/*<HotCollections data={dataHotCollection}/>*/}
        {/*<Newsletters/>*/}
        <FooterStyle2/>
    </div>;
};

export default Home;
