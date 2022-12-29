import Home from "./Home";
import MyNfts from './MyNfts'
import Explore02 from './Explore02'
import Creator from './Creator'
import Item from './Item'
import ItemDetails from './ItemDetails'
import Blog from './Blog'
import BlogDetails from './BlogDetails'
import Authors from './Authors'
import ConnectWallet from './ConnectWallet'
import CreateItem from './CreateItem'
import Login from './Login'
import Register from './Register'
import Contact from './Contact'

const routes = [
    {path: '/', component: <Home/>},
    {path: '/my_nfts', component: <MyNfts/>},
    {path: '/explore-02', component: <Explore02/>},
    {path: '/creator', component: <Creator/>},
    {path: '/item', component: <Item/>},
    {path: '/item-details', component: <ItemDetails/>},
    {path: '/blog', component: <Blog/>},
    {path: '/blog-details', component: <BlogDetails/>},
    {path: '/authors', component: <Authors/>},
    {path: '/connect-wallet', component: <ConnectWallet/>},
    {path: '/mint_tokens', component: <CreateItem/>},
    {path: '/sign_in', component: <Login/>},
    {path: '/sign_up', component: <Register/>},
    {path: '/contact', component: <Contact/>},
    {path: '/profile', component: <Authors/>},
    {path: '/*', component: <Home/>}
]

export default routes;