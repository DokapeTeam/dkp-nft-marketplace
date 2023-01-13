import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import {Config, DAppProvider, Goerli, Mainnet} from '@usedapp/core'
import {getDefaultProvider} from "ethers";

const config: Config =  {
    readOnlyChainId: 1337,
    readOnlyUrls: {
        1337 : 'http://127.0.0.1:8545/'
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

