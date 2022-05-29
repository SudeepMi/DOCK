import {signOut ,useSession} from 'next-auth/client'

function Header() {

    const [session] = useSession();

    return (
        <div className="sticky top-0 z-50 flex items-center px-4 py-2 shadow-md bg-white">
            <div id="pdfElement" style={{position: "absolute", top: -100}}></div>            
            <h1 className="inline-flex ml-2 mr-2 text-gray-700 text-2xl">Dock</h1>
            <div className="w-5 md:w-auto ml-2 flex flex-grow items-center pl-2 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
               
            </div>
            
            <img
                
                loading="lazy"
                className="cursor-pointer h-12 w-12 rounded-full ml-5"
                src={session?.user?.image}
                alt="image"
            />
            <button onClick={signOut} className="mx-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Logout</button>

        </div>
    );
}

export default Header;
