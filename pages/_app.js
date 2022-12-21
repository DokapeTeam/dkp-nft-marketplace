import '../styles/app.css'
import StickyFooter from "./footer/footer";
import Header from "./header/header";
import AccountDashboard from "./account_dashboard";

function MyApp({Component, pageProps}) {
    return <div>
        <Header/>
        <Component {...pageProps} />
        <StickyFooter/>
    </div>
}

export default MyApp
