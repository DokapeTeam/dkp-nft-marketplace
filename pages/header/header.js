import {routes} from "../../routes/routes";

export default function Header() {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">DKP Market Place</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {routes.map((route) =>
                        <a key={route} href={route.link}
                           className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            {route.name}
                        </a>)}
                </div>
                <div>
                    <a href="/mint_nfts"
                       className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Mint
                        Token</a>
                </div>
            </div>
        </nav>
    );
}