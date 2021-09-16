import Head from "next/head"
import Navbar from "../navbar/Navbar"
import Footer from "./Footer"
import {ToastContainer} from "react-toastify"

export default function Layout({children, error}) {
    const description = "The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps."
    return (
        <div className={"d-flex"}
             style={{
                 minHeight: "100vh",
                 flexDirection: "column"
             }}>
            <Head>
                <meta charSet="UTF-8"/>
                <meta content="IE=Edge" httpEquiv="X-UA-Compatible"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
                <meta name="apple-mobile-web-app-title" content="The Anime Index"/>
                <link rel="apple-touch-icon" sizes="180x180"
                      href="/favicon/apple-touch-icon.png"/>

                <link rel="icon" type="image/png" sizes="32x32"
                      href="/favicon/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16"
                      href="/favicon/favicon-16x16.png"/>
                <link rel="mask-icon" href="/favicon/safari-pinned-library.svg" color="#484848"/>
                <meta name="msapplication-config" content="/favicons/browserconfig.xml"/>
                <meta name="msapplication-TileColor" content="#2b5797"/>
                <meta name="theme-color" content="#000000"/>

                <link rel="manifest" href="/manifest.json"/>

                {error ?
                    <title>
                        Error {error} | {process.env.NEXT_PUBLIC_SITE_NAME}
                    </title> : <></>}

                <meta name="robots" content="index, archive, follow"/>

                <meta property="og:type" content="website"/>
                <meta name="twitter:site" content="@ranimepiracy"/>
                <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME}/>
                <meta name="twitter:card" content="summary"/>

                <meta property="og:title" content={process.env.NEXT_PUBLIC_SITE_NAME}/>
                <meta name="twitter:title" content={process.env.NEXT_PUBLIC_SITE_NAME}/>

                <meta name="description" content={description}/>
                <meta property="og:description" content={description}/>
                <meta name="twitter:description" content={description}/>

                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
                <meta property="og:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
            </Head>
            <header>
                <Navbar/>
            </header>

            <div className={"container my-4"}>
                <main>{children}</main>
            </div>

            <ToastContainer
                position={"bottom-right"}
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={"dark"}/>
            <Footer error={error}/>
        </div>
    )
}
