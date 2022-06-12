import 'tailwindcss/tailwind.css'
import "@material-tailwind/react/tailwind.css";
import Head from "next/head";
import { Provider } from 'next-auth/client';
import '../styles.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#90cdf4" />
            </Head>
            <Provider session={pageProps.session}>
                <Component {...pageProps} />
            </Provider>
        </>
    )
}

export default MyApp
