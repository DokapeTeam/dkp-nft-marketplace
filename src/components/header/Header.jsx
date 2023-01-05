import React, {useEffect, useRef, useState} from 'react';
import TopBar from './TopBar';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {ReactComponent as DkpLogo} from "../../assets/images/logo/dkp_logo.svg";
import menus from "../../pages/menu";
import DarkMode from "./DarkMode"

import icon from '../../assets/images/icon/connect-wallet.svg'
import {useEthers} from "@usedapp/core";


const Header = () => {
    const navigate = useNavigate()
    const {pathname} = useLocation();
    const headerRef = useRef(null)

    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });
    const isSticky = (e) => {
        const header = document.querySelector('.js-header');
        const scrollTop = window.scrollY;

        scrollTop >= 100 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed');
        scrollTop >= 120 ? header.classList.add('is-small') : header.classList.remove('is-small');
    };

    const menuLeft = useRef(null)
    const btnToggle = useRef(null)

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }


    const [activeIndex, setActiveIndex] = useState(null);
    const {account, deactivate, activateBrowserWallet} = useEthers()

    return <div>
        <TopBar/>
        <header id="header_main" className="header_1 js-header" ref={headerRef}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                        <div id="site-header-inner" className="flex">
                            <div id="site-logo" className="clearfix">
                                <div id="site-logo-inner">
                                    <Link to="/" rel="home" className="main-logo">
                                        <DkpLogo width={50} height={50}/>
                                        {/*<img id="logo_header" className='logo-dark' src={logo} srcSet={logo2x}*/}
                                        {/*     alt="nft-gaming"/>*/}
                                        {/*<img id="logo_header" className='logo-light' src={logolight}*/}
                                        {/*     srcSet={logolight2x} alt="nft-gaming"/>*/}
                                    </Link>
                                </div>
                            </div>

                            {/*<form className="form-search">*/}
                            {/*    <input type="text" placeholder="Search here"/>*/}
                            {/*    <button><i className="far fa-search"></i></button>*/}
                            {/*</form>*/}
                            <nav id="main-nav" className="main-nav" ref={menuLeft}>
                                <ul id="menu-primary-menu" className="menu">
                                    {
                                        menus.map((data, index) => (
                                            <li key={index}
                                                className={`menu-item menu-item ${activeIndex === index ? 'active' : ''} `}>
                                                <Link to={data.url}>{data.name}</Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </nav>
                            {<div className="button-connect-wallet">
                                <a href="" className="sc-button wallet style-2"
                                   onClick={() => account ? deactivate() : activateBrowserWallet()}>
                                    <img src={icon} alt="icon"/>
                                    <span>{account ? 'Disconnect' : 'Connect Wallet'}</span>
                                </a>
                            </div>
                            }
                            <DarkMode/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>;
};

export default Header;
