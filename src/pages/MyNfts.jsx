import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import Header from '../components/header/Header';
import PopularCollection from '../components/layouts/explore/PopularCollection';
import Footer from '../components/footer/Footer';
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {marketAddress, nftAddress} from "../config";
import axios from "axios";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "../firebase";

const MyNfts = () => {

    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState(false)

    useEffect(() => {
        getUsers().then(users => {
            loadNFTs(users)
        })

    }, [])

    const getUsers = async () => {
        const response = await getDocs(collection(firestore, 'authors'))
        const users = response.docs.map((doc, index) => doc.data())
        if (users !== null) {
            return users
        }
    }
    async function loadNFTs(users) {
        try {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()

            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
            const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)
            const data = await marketContract.fetchMyNFTs()

            const currencyRateResponse = await axios.get('https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
            const usdCurrencyRate = currencyRateResponse.data['price']

            const items = await Promise.all(data.map(async item => {
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
                }
            }))
            setNFts(items)
            setLoadingState(true)
        }catch (e){
            console.log(e)
            setLoadingState(true)
        }
    }


    return <div className='explore'>
        <Header/>
        <section className="fl-page-title">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-inner flex">
                            <div className="page-title-heading">
                                <h2 className="heading">My NFTs</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>My NFTs</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*<LatestCollection data={dataCollections} />*/}
        <PopularCollection data={nfts} loaded={loadingState}/>
        {/*<Newsletters />*/}
        <Footer/>
    </div>;
};

export default MyNfts;
