import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Header from '../components/header/Header';
import 'react-tabs/style/react-tabs.css';
import LiveAution from '../components/layouts/home02/LiveAution';
import dataLiveAution from '../assets/fake-data/dataLiveAution'
import Footer from '../components/footer/Footer';

import img1 from '../assets/images/avatar/avt-6.jpg'
import img2 from '../assets/images/avatar/avt-2.jpg'
import img3 from '../assets/images/avatar/avt-4.jpg'
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {marketAddress, nftAddress} from "../config";
import DKPMarket from "../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json";
import {useEthers} from "@usedapp/core";

const ItemDetails = () => {
    const {state} = useLocation();
    const {item} = state
    const [dataHistory] = useState(
        [
            {
                img: img1,
                name: "@Johnson",
                time: "8 hours ago ",
                price: "25 ETH ",
            },
            {
                img: img2,
                name: "@Johnson",
                time: "8 hours ago ",
                price: "25 ETH ",
            },
            {
                img: img3,
                name: "@Johnson",
                time: "8 hours ago ",
                price: "25 ETH ",
            },
        ]
    )
    const navigate = useNavigate()

    const {account} = useEthers()

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
        await navigate('/')
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
    });

    return <div className='item-details'>
        <Header/>
        <section className="fl-page-title">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-inner flex">
                            <div className="page-title-heading">
                                <h2 className="heading">NFT Details</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>NFT Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="tf-section item-details-page">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-12 col-md-12">
                        <div className="item-media">
                            <div className="media">
                                <img src={item.image} alt="dkp"/>
                            </div>
                            {/*<div className="countdown style-2">*/}
                            {/*    <Countdown date={Date.now() + 500000000}/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-12 col-md-12">
                        <div className="content-item">
                            <h3>{item.name}</h3>
                            <p className="mg-bt-42">{item.description}</p>
                            <div className="author-item">
                                <div className="avatar">
                                    <img src={item.author.photoUrl} alt="dkp"/>
                                </div>
                                <div className="infor">
                                    <div className="create">Owner By</div>
                                    <h6><Link to="/authors">{item.author.displayName}</Link></h6>
                                    <div className="widget-social">
                                        <ul>
                                            <li><Link to="#" className="active"><i
                                                className="fab fa-facebook-f"></i></Link>
                                            </li>
                                            <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                                            <li><Link to="#"><i className="fab fa-instagram"></i></Link></li>
                                            <li><Link to="#"><i className="fab fa-linkedin-in"></i></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-details-item">
                                <li>
                                    <span className="name">Current Price: </span>
                                    <span
                                        className="price">{item.price} ETH ~ {formatter.format(item.usdPrice)}
                                    </span>
                                    {/*<span className="pagi">1 of 5</span>*/}
                                </li>
                                {/*<li>Size 14000 x 14000 px</li>*/}
                                {/*<li> Volume Traded 64.1</li>*/}
                            </ul>
                            {/*<div className="author-bid">*/}
                            {/*    <div className="author-item">*/}
                            {/*        <div className="avatar">*/}
                            {/*            <img src={avt2} alt="dkp"/>*/}
                            {/*        </div>*/}
                            {/*        <div className="infor">*/}
                            {/*            <h6><Link to="/authors">Keith J. Kelley</Link></h6>*/}
                            {/*            <div className="create">Creators</div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className="author-item">*/}
                            {/*        <div className="avatar">*/}
                            {/*            <img src={avt3} alt="dkp"/>*/}
                            {/*        </div>*/}
                            {/*        <div className="infor">*/}
                            {/*            <h6><Link to="/authors">David Michels</Link></h6>*/}
                            {/*            <div className="create">Collection</div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*</div>*/}
                            {/*<div className="infor-bid">*/}
                            {/*    <div className="content-left">*/}
                            {/*        <h6>Highest Bid</h6>*/}
                            {/*        <div className="price">9.3 BNB</div>*/}
                            {/*    </div>*/}
                            {/*    /!*<div className="pagi">1 Of 9</div>*!/*/}
                            {/*</div>*/}
                            {!item.sold && (account !== item.seller) &&
                                <Link to="#" onClick={() => buyNFT(item)}
                                      className="sc-button style letter style-2 style-item-details"><span>Buy</span>
                                </Link>
                            }
                            {/*<div className="flat-tabs themesflat-tabs">*/}
                            {/*    <Tabs>*/}
                            {/*        <TabList>*/}
                            {/*            <Tab>Bid</Tab>*/}
                            {/*            <Tab>History</Tab>*/}
                            {/*            <Tab>Details</Tab>*/}
                            {/*        </TabList>*/}

                            {/*        <TabPanel>*/}
                            {/*            <ul className="bid-history-list">*/}
                            {/*                {*/}
                            {/*                    dataHistory.map((item, index) => (*/}
                            {/*                        <li key={index}>*/}
                            {/*                            <div className="content">*/}
                            {/*                                <div className="author-item">*/}
                            {/*                                    <div className="avatar">*/}
                            {/*                                        <img src={item.img} alt="dkp"/>*/}
                            {/*                                    </div>*/}
                            {/*                                    <div className="infor">*/}
                            {/*                                        <p>Bid listed for <span*/}
                            {/*                                            className="status">{item.price}</span>*/}
                            {/*                                            {item.time}*/}
                            {/*                                            by <span className="creator">{item.name}</span>*/}
                            {/*                                        </p>*/}
                            {/*                                    </div>*/}
                            {/*                                </div>*/}
                            {/*                            </div>*/}
                            {/*                        </li>*/}
                            {/*                    ))*/}
                            {/*                }*/}
                            {/*            </ul>*/}
                            {/*        </TabPanel>*/}
                            {/*        <TabPanel>*/}
                            {/*            <ul className="bid-history-list">*/}
                            {/*                <li>*/}
                            {/*                    <div className="content">*/}
                            {/*                        <div className="author-item">*/}
                            {/*                            <div className="avatar">*/}
                            {/*                                <img src={img1} alt="dkp"/>*/}
                            {/*                            </div>*/}
                            {/*                            <div className="infor">*/}
                            {/*                                <p>Bid listed for <span className="status">25 ETH 8</span>*/}
                            {/*                                    hours ago*/}
                            {/*                                    by <span className="creator">@Johnson</span></p>*/}
                            {/*                            </div>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </li>*/}
                            {/*            </ul>*/}
                            {/*        </TabPanel>*/}
                            {/*        <TabPanel>*/}
                            {/*            <div className="provenance">*/}
                            {/*                <p>lorem Ipsum is simply dummy text of the printing and typesetting*/}
                            {/*                    industry.*/}
                            {/*                    Lorem Ipsum has been the industry's standard dummy text ever since*/}
                            {/*                    the 1500s,*/}
                            {/*                    when an unknown printer took a galley of type and scrambled it to*/}
                            {/*                    make a type specimen book.*/}
                            {/*                    It has survived not only five centuries, but also the leap into*/}
                            {/*                    electronic typesetting,*/}
                            {/*                    remaining essentially unchanged. It was popularised in the 1960s*/}
                            {/*                    with the release of Letraset sheets containing Lorem Ipsum passages,*/}
                            {/*                    and more recently with desktop publishing software like Aldus*/}
                            {/*                    PageMaker including versions of Lorem Ipsum.</p>*/}
                            {/*            </div>*/}
                            {/*        </TabPanel>*/}
                            {/*    </Tabs>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <LiveAution data={dataLiveAution}/>
        {/*<Newsletters/>*/}
        <Footer/>
    </div>;
};

export default ItemDetails;
