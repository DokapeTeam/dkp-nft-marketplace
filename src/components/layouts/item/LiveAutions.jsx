import React from 'react';
import {Link} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Grid, Navigation, Scrollbar} from 'swiper';
import Countdown from "react-countdown";
import {Dropdown} from 'react-bootstrap';

const LiveAutions = props => {
    const data = props.data
    return (
        <section className="tf-section auctions-page">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="sc-heading style-2 has-icon">
                            <div className="content-left">

                                <div className="inner">
                                    <div className="group">
                                        <div className="icon"><i className="ripple"></i></div>
                                        <h3>Live Auctions</h3>
                                    </div>
                                    <p className="desc">Most popular gaming digital nft market place </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="swiper-container popular-coll-2">
                            <div className="swiper-wrapper">
                                <Swiper
                                    modules={[Navigation, Scrollbar, A11y, Grid]}
                                    spaceBetween={30}

                                    breakpoints={{
                                        0: {
                                            slidesPerView: 1,
                                        },
                                        767: {
                                            slidesPerView: 2,
                                        },
                                        991: {
                                            slidesPerView: 4,
                                        },
                                    }}
                                    grid={{
                                        "rows": 2
                                    }}
                                    navigation
                                    scrollbar={{draggable: true}}
                                >
                                    {
                                        data.map((item, index) => {
                                            console.log(item)
                                            return (
                                                <SwiperSlide key={index}>
                                                    <LiveAutionsItem item={item}/>
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LiveAutionsItem = props => {
    console.log(props)
    return (
        <div className="slider-item">
            <div className="sc-product-item style-6">
                <div className="product-img">
                    <img src={props.item.image}/>
                    <Link to="/connect-wallet"
                          className="sc-button style letter"><span>Place Bid</span></Link>
                    <label>{props.item.name}</label>
                </div>
                <div className="product-content">
                    <h5 className="title"><Link to="/item-details">{props.item.description}</Link></h5>
                    <div className="product-price">
                        <div className="title">Current Bid</div>
                        <div className="price">
                            <span>{props.item.price} ETH</span>
                            <span>= {props.item.usdPrice} USD</span>
                        </div>
                    </div>
                </div>
                <div className="countdown">
                    <Countdown date={Date.now() + 500000000}>
                        <span>You are good to go!</span>
                    </Countdown>
                </div>
            </div>
        </div>
    )
}

export default LiveAutions;
