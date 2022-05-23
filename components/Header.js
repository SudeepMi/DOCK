import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import {signOut ,useSession} from 'next-auth/client'

function Header() {

    const [session] = useSession();

    return (
        <div className="sticky top-0 z-50 flex items-center px-4 py-2 shadow-md bg-white">
            <div id="pdfElement" style={{position: "absolute", top: -100}}></div>
            <Button
                color="gray"
                buttonType="outline"
                rounded={true}
                iconOnly={true}
                ripple="dark"
                className="hidden md:inline-flex h-20 w-20 border-0"
            >
                <Icon name="menu" size="3xl" />
            </Button>
            
            <h1 className="inline-flex ml-2 mr-2 text-gray-700 text-2xl">Dock</h1>
            <div className="w-5 md:w-auto ml-2 flex flex-grow items-center pl-2 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
               
            </div>
            {/* <Button
                color="gray"
                buttonType="outline"
                rounded={true}
                iconOnly={true}
                ripple="dark"
                className="hidden md:inline-flex ml-5 md:ml-20 h-20 w-20 border-0"
            >
                <Icon name="apps" size="3xl" color="gray" />
            </Button> */}
            <img
                onClick={signOut}
                loading="lazy"
                className="cursor-pointer h-12 w-12 rounded-full ml-5"
                src={session?.user?.image}
                alt="image"
            />
            <button>Export</button>
        </div>
    );
}

export default Header;
