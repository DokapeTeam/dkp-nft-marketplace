import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap';
import {categories} from "../../../constants";
import {Empty, Spin} from "antd";
import authorAvt from '../../../assets/images/avatar/author.jpg'

const PopularCollection = props => {
    const navigate = useNavigate()
    const data = props.data;
    const loaded = props.loaded

    const [nfts, setNfts] = useState(data)

    useEffect(() => {
        setNfts(data)
    }, [data])

    const [visible, setVisible] = useState(4);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
    });

    const [filterCategory, setFilterCategory] = useState(null)
    const [sortByDateCreate, setSortByDateCreate] = useState(null)

    const filterNft = () => {
        let newData = data
        console.log(newData, 'new data')
        if (filterCategory) {
            newData = data.filter(item => item.category === filterCategory)
        }
        if (sortByDateCreate) {
            newData = data.sort(function (a, b) {
                return b.createdDate - a.createdDate;
            })
        } else if (sortByDateCreate === false) {
            newData = data.sort(function (a, b) {
                return a.createdDate - b.createdDate;
            })
        }
        setNfts([...newData])
    }

    const handleItemClick = (item) => {
        navigate('/item-details', {state: {item}})
    }

    return (
        <section className="tf-section trendy-colection-page style-2">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="wg-drop-category seclect-box" style={{justifyContent: "center"}}>
                            <Dropdown style={{marginRight: 32, marginLeft: 32}}>
                                <Dropdown.Toggle className="btn-selector nolink" id="dropdown-basic">
                                    <span>{filterCategory ? categories[filterCategory] : 'All Categories'}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        Object.keys(categories).map((key, index) => {
                                            return <Dropdown.Item key={index} onClick={() => setFilterCategory(key)}>
                                                <span>{categories[key]}</span>
                                            </Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown style={{marginRight: 32, marginLeft: 32}}>
                                <Dropdown.Toggle className="btn-selector nolink" id="dropdown-basic">
                                    <span>{sortByDateCreate !== null ? sortByDateCreate ? "Newest" : "Lowest" : "Date Created"}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="" onClick={() => setSortByDateCreate(true)}>
                                        <span>Newest</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="" onClick={() => setSortByDateCreate(false)}>
                                        <span>Lowest</span>
                                    </Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                            <button style={{marginRight: 32, marginLeft: 32}}
                                    className="sc-button style letter style-2" onClick={filterNft}><span>Filter</span>
                            </button>
                            <button className="sc-button style letter style-2" onClick={filterNft}><span>Clear Filter</span>
                            </button>
                        </div>
                    </div>
                    {
                        loaded ? nfts.length > 0 ? (nfts.slice(0, visible).map((item, index) => (
                                <div key={index} className="fl-item col-xl-3 col-lg-4 col-md-6">
                                    <div className="sc-product-item style-5">
                                        <div className="product-img">
                                            <img src={item.image} alt="Dkp" style={{height: 200}}/>
                                            {!item.sold &&
                                                <Link to="" className="sc-button style letter"
                                                      onClick={() => props.onBuy(item)}><span>Buy</span></Link>}
                                            <label style={{borderRadius: 4}}>{item.category.toUpperCase()}</label>
                                        </div>
                                        <div className="product-content">
                                            <h5 onClick={() => handleItemClick(item)} className="title"><a
                                                href=''>{item.name}</a></h5>
                                            <p className="title">{item.description}</p>
                                            <div className="product-author flex" style={{marginBottom: 22}}>
                                                <div className="avatar">
                                                    <img src={authorAvt} alt="dkp"/>
                                                </div>
                                                <div className="infor">
                                                    <div className="author-name"><Link to="/authors">Anh Tran Si Nguyen</Link>
                                                    </div>
                                                    <span>Creator</span>
                                                </div>
                                            </div>
                                            <div className="price">
                                                <span>{item.price} ETH</span>
                                                <span> ~ {formatter.format(item.usdPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Data"}
                                          style={{color: "white", margin: "0 auto"}}/>) :
                            <Spin style={{margin: "0 auto"}} size={'large'}/>
                    }
                    {
                        visible < nfts.length &&
                        <div className="col-md-12">
                            <button id="loadmore" className=" sc-button style letter style-2" onClick={showMoreItems}>
                                <span>Explore More</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </section>
    );
};

export default PopularCollection;
