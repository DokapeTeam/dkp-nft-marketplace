/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {useCallback, useEffect, useReducer, useState} from "react";
import Navbar from "../navbar/navbar";
import useScroll from "./../../../hooks/useScroll";
import NavItem from "../navbar/nav-item";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from 'walletlink';
import Web3Modal from "web3modal";
import {providers} from "ethers";

const INFURA_ID = '25dc0faf706e414c840be5c220004aa3'

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: INFURA_ID // required
        }
    },
    'custom-walletlink': {
        display: {
            logo:
                'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
            name: 'Coinbase',
            description: 'Connect to Coinbase Wallet (not Coinbase App)'
        },
        options: {
            appName: 'DKP Marketplace', // Your app name
            networkUrl: `http://127.0.0.1:8545/`,
            chainId: 1337
        },
        package: WalletLink,
        connector: async (_, options) => {
            const {appName, networkUrl, chainId} = options
            const walletLink = new WalletLink({
                appName
            })
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
            await provider.enable()
            return provider
        }
    }
}
let web3Modal
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: false,
        providerOptions // required
    })
}

type StateType = {
    provider?: any
    web3Provider?: any
    address?: string
    chainId?: number
}

type ActionType =
    | {
    type: 'SET_WEB3_PROVIDER'
    provider?: StateType['provider']
    web3Provider?: StateType['web3Provider']
    address?: StateType['address']
    chainId?: StateType['chainId']
}
    | {
    type: 'SET_ADDRESS'
    address?: StateType['address']
}
    | {
    type: 'SET_CHAIN_ID'
    chainId?: StateType['chainId']
}
    | {
    type: 'RESET_WEB3_PROVIDER'
}

const initialState: StateType = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null
}

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case 'SET_WEB3_PROVIDER':
            return {
                ...state,
                provider: action.provider,
                web3Provider: action.web3Provider,
                address: action.address,
                chainId: action.chainId
            }
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.address
            }
        case 'SET_CHAIN_ID':
            return {
                ...state,
                chainId: action.chainId
            }
        case 'RESET_WEB3_PROVIDER':
            return initialState
        default:
            throw new Error()
    }
}


export default function HeaderHomeThree() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleCloseMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const scroll = useScroll();

    const [state, dispatch] = useReducer(reducer, initialState)
    const {provider, web3Provider, address, chainId} = state

    const connect = useCallback(async function () {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const provider = await web3Modal.connect()

        // We plug the initial `provider` into ethers.js and get back
        // a Web3Provider. This will add on methods from ethers.js and
        // event listeners such as `.on()` will be different.
        const web3Provider = new providers.Web3Provider(provider)

        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()
        console.log('SET ADDRESS FROM CONNECT', address)
        const network = await web3Provider.getNetwork()

        dispatch({
            type: 'SET_WEB3_PROVIDER',
            provider,
            web3Provider,
            address,
            chainId: network.chainId
        })
    }, [])

    const disconnect = useCallback(
        async function () {
            await web3Modal.clearCachedProvider()
            if (provider?.disconnect && typeof provider.disconnect === 'function') {
                await provider.disconnect()
            }
            dispatch({
                type: 'RESET_WEB3_PROVIDER'
            })
        },
        [provider]
    )

    // Auto connect to the cached provider
    useEffect(() => {
        console.log('web3Modal.cachedProvider', web3Modal.cachedProvider)
        if (web3Modal.cachedProvider) {
            connect()
        }
    }, [connect])

    // A `provider` should come with EIP-1193 events. We'll listen for those events
    // here so that when a user switches accounts or networks, we can update the
    // local React state with that new information.
    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                // eslint-disable-next-line no-console
                console.log('accountsChanged from event', accounts)
                dispatch({
                    type: 'SET_ADDRESS',
                    address: accounts[0]
                })
            }

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId: string) => {
                window.location.reload()
            }

            const handleDisconnect = async (error: { code: number; message: string }) => {
                // eslint-disable-next-line no-console
                console.log('disconnect', error)
                await disconnect()
            }

            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)
            provider.on('disconnect', handleDisconnect)

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountsChanged', handleAccountsChanged)
                    provider.removeListener('chainChanged', handleChainChanged)
                    provider.removeListener('disconnect', handleDisconnect)
                }
            }
        }
    }, [provider, disconnect])


    return (
        <header
            className={`site-header site-header--menu-right fugu--header-section fugu--header-three ${
                scroll ? "sticky-menu" : ""
            }`}
            id="sticky-menu"
        >
            <div className="container-fluid">
                <nav className="navbar site-navbar">
                    <div className="brand-logo">
                        <Link href={"/"}>
                            <img src="/images/logo/logo-white.svg" alt="" className="light-version-logo"/>
                        </Link>
                    </div>
                    <div className="menu-block-wrapper">
                        <div
                            className={`menu-overlay ${isMobileMenuOpen ? "active" : null}`}
                            onClick={handleCloseMobileMenu}
                        ></div>
                        <nav className={`menu-block ${isMobileMenuOpen ? "active" : null}`} id="append-menu-header">
                            <div className="mobile-menu-head">
                                <div className="mobile-menu-close" onClick={handleCloseMobileMenu}>
                                    &times;
                                </div>
                            </div>

                            <Navbar>
                                <NavItem navItemText="Home" href={"./"}/>
                                <NavItem navItemText="Mint Token" href={"/mint_token"}/>
                                <NavItem navItemText="My NFTs" href={"/my_nfts"}/>
                                <NavItem navItemText="Account Dashboard" href={"/account_dashboard"}/>
                            </Navbar>
                        </nav>
                    </div>
                    <div className="header-btn header-btn-l1 ms-auto d-none d-xs-inline-flex">
                        {
                            web3Provider ? (<button className="fugu--btn fugu--menu-btn1" onClick={disconnect}>
                                Disconnect Wallet
                            </button>) : (<button className="fugu--btn fugu--menu-btn1" onClick={connect}>
                                Connect Wallet
                            </button>)
                        }
                    </div>
                    <div className="mobile-menu-trigger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span></span>
                    </div>
                </nav>
            </div>
        </header>
    );
}
