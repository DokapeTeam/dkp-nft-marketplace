import dynamic from "next/dynamic";
import Head from "next/head";

import CardSliderOne from "../components/common/sliders/card/card-slider-one";
import HeroSection from "../components/home-three/hero-section";
import NewsLetter from "../components/home-three/news-letter";
import NftRoadMap from "../components/home-three/nft-roadmap";
import {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";
import {marketAddress, nftAddress} from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import Web3Modal from "web3modal";

const FilterGalarryOne = dynamic(() => import("../components/common/filter-gallary/filter-gallary-one"), {
    ssr: false,
});

export default function Index() {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    //
    let items = []

    useEffect(() => {
        loadNFTs()
    }, [])
    useEffect(() => {
        setLoadingState('loaded')
    }, [items])

    //
    async function loadNFTs() {

        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, provider)
        const data = await marketContract.fetchMarketTokens()
        console.log(data)
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
                description: meta.data.description
            }
        }))
        setNFts(items)
    }

    async function buyNFT(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
            value: price
        })

        await transaction.wait()
        await loadNFTs()
    }

    const handleItem = (item) => {
        buyNFT(item)
    }


    return (<>
        <Head>
            <title>DKP Marketplace</title>
        </Head>
        <HeroSection/>
        <CardSliderOne/>
        {
            (loadingState === 'loaded' && nfts.length === 0) ? (
                <h1
                    className='px-20 py-7 text-4x1'>No NFts in marketplace
                </h1>

            ) : <FilterGalarryOne nfts={nfts} handleItem={handleItem}/>
        }
        {/*<TextSliderTwo/>*/}
        {/*<Team/>*/}
        <NftRoadMap/>
        <NewsLetter/>
    </>);
}

export async function getStaticProps() {
    return {props: {header: "three", footer: "three"}};
}
