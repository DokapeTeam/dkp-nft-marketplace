import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";
import {nftAddress, nftMarketAddress} from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'

export default function Home() {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    //
    useEffect( () => {
         loadNFTs()
    }, [])
    //
    async function loadNFTs() {

        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftMarketAddress, DKPMarket.abi, provider)
        const data = await marketContract.fetchMarketTokens()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            // we want get the token metadata - json
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            return {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
        }))

        setNFts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1
        className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>)
    return (
        <div className={styles.container}>
            <Head>
                <title>DKPMarketplace</title>
                <meta name="description" content="Dokape NFT Marketplace"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

        </div>
    )
}
