import FooterHomeThree from "./footer/footer-home-three";
import HeaderHomeThree from "./header/header-home-three";

export default function Layout({children}) {

    return (
        <>
            <HeaderHomeThree/>
            <main>{children}</main>
            <FooterHomeThree/>
        </>
    );
}
