import {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import Web3Modal from "web3modal";
import {marketAddress, nftAddress} from "../config";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {Col, Row} from "react-bootstrap";

export default function MyNfts() {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        // what we want to load:
        // we want to get the msg.sender hook up to the signer to display the owner nfts

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            // we want get the token metadata - json
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
            return item
        }))

        setNFts(items)
        setLoadingState('loaded')
    }

    if (loadingState === 'loaded' && !nfts.length) return (<h1
        className='px-20 py-7 text-4x1'>You do not own any NFTs currently :(</h1>)
    return (
        <div className="section-my-nft">
            <CssBaseline/>
            <Container>
                <Row>
                    {
                        nfts.map((nft) => <Col sm={12} xs={6} md={6} lg={3} key={nft}>
                            <div className="fugu--card-wrap">
                                <div className="fugu--card-thumb">
                                    <img src={nft.image} alt=""/>
                                </div>
                                <div className="fugu--card-data">
                                    <h3>{nft.name}</h3>
                                    <p>{nft.description}</p>
                                    <div className="fugu--card-footer">
                                        <div className="fugu--card-footer-data">
                                            <span>Price:</span>
                                            <h4>{nft.price} ETH</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>)
                    }
                </Row>
            </Container>
        </div>
    )
}