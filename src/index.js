import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import {Config, DAppProvider, Goerli, Mainnet} from '@usedapp/core'
import {getDefaultProvider} from "ethers";

const config: Config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
        [Mainnet.chainId]: getDefaultProvider('mainnet'),
        [Goerli.chainId]: getDefaultProvider('goerli'),
    },
}

ReactDOM.render(
    <BrowserRouter>
        <DAppProvider config={config}>
            <ScrollToTop/>
            <App/>
        </DAppProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

