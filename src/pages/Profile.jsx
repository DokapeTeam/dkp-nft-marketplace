import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {marketAddress, nftAddress} from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import DKPMarket from "../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json";
import axios from "axios";
import PopularCollection from "../components/layouts/explore/PopularCollection";
import {Container} from "react-bootstrap";
import {useEtherBalance, useEthers} from '@usedapp/core'
import {formatEther} from '@ethersproject/units'
import {Row} from "antd";
import {MDBCardText} from "mdb-react-ui-kit";
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "../firebase";
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

const Profile = () => {
    const navigate = useNavigate();
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState(false)
    const [user, setUser] = useState()


    const getUsers = async () => {
        const response = await getDocs(collection(firestore, 'authors'))
        const users = response.docs.map((doc, index) => doc.data())
        if (users !== null) {
            if (account !== null) {
                let user = users.find((user) => user.walletAddress === account)
                setUser(user)
            }
            return users
        }
    }

    useEffect(() => {
        getUsers().then((users) => loadNFTs(users))
    }, [])

    const loadNFTs = async (users) => {
        try {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()

            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
            const marketContract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)
            const data = await marketContract.fetchItemsCreated()

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
            console.log(items)
            setLoadingState(true)
        } catch (e) {
            console.log(e)
            setLoadingState(true)
        }
    }

    const {account} = useEthers()
    const etherBalance = useEtherBalance(account)

    return <div className='authors'>
        <Header/>
        <section className="fl-page-title">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-inner flex">
                            <div className="page-title-heading">
                                <h2 className="heading">Profile</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li onClick={() => {
                                    }}>Profile
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <Container className='top-profile-section '>
            <Row>
                {user ? <img src={user.photoUrl} className='profile-avatar'/> :
                    <Card.Img variant="top" src="holder.js/100px180"/>}
                <div className="product-content profile-information col-md-7">
                    {user ? <h4 className="title">{user.displayName}</h4> :
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6}/>
                        </Placeholder>
                    }
                    <br/>
                    <div className="product-author flex">
                        <div className="author-name" style={{fontWeight: 'bold'}}>
                            {user ? <h6>{user.role}</h6> :
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6}/>
                                </Placeholder>
                            }
                        </div>
                    </div>
                    <br/>
                    <p>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                        leap into electronic typesetting, remaining essentially unchanged. It was popularised in the
                        1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                        with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <Row style={{marginTop: 32}}>
                        {
                            account && <div className="wallet-address">
                                <MDBCardText className="mb-1 h3">Wallet Address: </MDBCardText>
                                <MDBCardText className="mb-1 h4">{account.slice(0, 6)}...{account.slice(
                                    account.length - 4,
                                    account.length
                                )} </MDBCardText>
                            </div>
                        }
                        <div className='col-md-4'></div>
                        {etherBalance && (
                            <div className="balance">
                                <MDBCardText className="mb-1 h3">Balance: </MDBCardText>
                                <MDBCardText className="mb-1 h4">{formatEther(etherBalance)} ETH </MDBCardText>
                            </div>
                        )}
                    </Row>
                </div>
                <div className="p-4 text-black" style={{marginLeft: 48}}>
                    <div className="d-flex justify-content-end text-center py-1">
                        <div>
                            <MDBCardText className="mb-1 h4">{nfts.length}</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">NFTs</MDBCardText>
                        </div>
                        <div className="px-3">
                            <MDBCardText className="mb-1 h4">1026</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                        </div>
                        <div>
                            <MDBCardText className="mb-1 h4">478</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
        <PopularCollection data={nfts} loaded={loadingState}/>
        {/*<TopSeller data={dataBestSeller}/>*/}
        {/*<HotCollection data={dataHotCollection2}/>*/}
        {/*<Newsletters/>*/}
        <Footer/>
    </div>;
};

export default Profile;
