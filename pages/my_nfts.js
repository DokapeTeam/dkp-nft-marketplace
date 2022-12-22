import {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import Web3Modal from "web3modal";
import {marketAddress, nftAddress} from "../config";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    )
}