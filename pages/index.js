import {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";
import {marketAddress, nftAddress} from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Web3Modal from "web3modal";

export default function Home() {
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
    if (loadingState === 'loaded' && nfts.length === 0) return (<h1
        className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>)
    return (
        <div>
            <CssBaseline/>
            <Container sx={{py: 8}} maxWidth="md">
                <Grid container spacing={4}>
                    {nfts.map((nft) =>
                        <Grid item xs={12} sm={6} md={4} key={nft}>
                            <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        // 16:9
                                        pt: '0',
                                    }}
                                    image={nft.image}
                                    alt="random"
                                />
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {nft.name}
                                    </Typography>
                                    <Typography>
                                        {nft.description}
                                    </Typography>
                                    <Typography>
                                        {nft.price} ETH
                                    </Typography>
                                </CardContent>
                                <CardActions style={{justifyContent: 'end'}}>
                                    <button className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'
                                            onClick={() => buyNFT(nft)}>Buy
                                    </button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    )
}
