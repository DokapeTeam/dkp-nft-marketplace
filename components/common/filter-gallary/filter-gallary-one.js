/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {Col, Row} from "react-bootstrap";

export default function FilterGalarryOne({nfts, handleItem}) {
    const isotope = useRef();
    const [activeClass, setActiveClass] = useState("*");
    const [filterKey, setFilterKey] = useState("*");
    // useEffect(() => {
    //     setTimeout(() => {
    //         isotope.current = new Isotope("#fugu--four-column", {
    //             itemSelector: ".collection-grid-item",
    //
    //             resizable: false,
    //             masonry: {
    //                 columnWidth: ".collection-grid-item",
    //                 gutterWidth: 0,
    //             },
    //         });
    //     }, 1000);
    //     return () => isotope.current.destroy();
    // }, []);

    useEffect(() => {
        if (isotope.current)
            filterKey === "*"
                ? isotope.current.arrange({filter: `*`})
                : isotope.current.arrange({filter: `.${filterKey}`});
    }, [filterKey]);

    const handleFilterKeyChange = (key) => () => {
        setFilterKey(key);
        setActiveClass(key);
    };

    const handleActiveClass = (key) => {
        if (key === activeClass) return "active";
    };
    return (
        <div className="fugu--portfolio-section fugu--section-padding">
            <div className="container">
                <div className="fugu--section-title">
                    <div className="fugu--default-content content-sm">
                        <h2>Explore the most unique artworks</h2>
                        <p>
                            NFTs are usually associated with non-physical art but in reality, there are several
                            different types of NFTs and are explained in this guide.
                        </p>
                    </div>
                </div>

                <div className="fugu--portfolio-menu">
                    <ul className="option-set clear-both">
                        <li onClick={handleFilterKeyChange("*")} className={handleActiveClass("*")}>
							<span>
								<img src="/images/all-img/v3/m-icon1.png" alt=""/> Artworks
							</span>
                        </li>
                        <li onClick={handleFilterKeyChange("video")} className={handleActiveClass("video")}>
							<span>
								<img src="/images/all-img/v3/m-icon2.png" alt=""/>
								Video-Game
							</span>
                        </li>
                        <li onClick={handleFilterKeyChange("virtual")} className={handleActiveClass("virtual")}>
							<span>
								<img src="/images/all-img/v3/m-icon3.png" alt=""/> Virtual Land
							</span>
                        </li>
                        <li onClick={handleFilterKeyChange("domain")} className={handleActiveClass("domain")}>
							<span>
								<img src="/images/all-img/v3/m-icon4.png" alt=""/> Domain Names
							</span>
                        </li>
                        <li onClick={handleFilterKeyChange("music")} className={handleActiveClass("music")}>
							<span>
								<img src="/images/all-img/v3/m-icon5.png" alt=""/>
								Music
							</span>
                        </li>
                        <li onClick={handleFilterKeyChange("sports")} className={handleActiveClass("sports")}>
							<span>
								<img src="/images/all-img/v3/m-icon6.png" alt=""/>
								Sports
							</span>
                        </li>
                    </ul>
                </div>
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
                                            <span>Mint Price:</span>
                                            <h4>{nft.price} ETH</h4>
                                        </div>
                                        <div onClick={() => handleItem(nft)}><Link href={""}>
                                            <a className="fugu--btn btn-sm bg-white">Buy</a>
                                        </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>)
                    }
                </Row>
                <div className="fugu--portfolio-btn">
                    <Link href={"#"} legacyBehavior>
                        <a className="fugu--outline-btn">
                            <span>View All NFTs</span>
                        </a>
                    </Link>
                </div>
            </div>
            <div className="fugu--shape2">
                <img src="/images/shape2/shape2.png" alt=""/>
            </div>
        </div>
    );
}
