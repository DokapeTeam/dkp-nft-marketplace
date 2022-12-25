import {useState} from "react";

export default function NavItem({navItemText, href}) {
    const [isOpenDropDown, setIsOpenDropDown] = useState(false);
    const handleClick = (e) => {
        setIsOpenDropDown(!isOpenDropDown);
    };

    return (
        <li className={`nav-item`}>
            <a href={href} className="nav-link-item drop-trigger" onClick={handleClick}>
                {navItemText}
            </a>
        </li>
    );
}
