import Head from 'next/head'
import Link from 'next/link'
import Navbar from "./navbar";
import Footer from "./footer";

const name = 'Your Name'
export const siteTitle = '/r/animepiracy Index'

export default function Layout({children, home, tabs}) {
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

                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
                <meta name="apple-mobile-web-app-title" content="index"/>
                <link rel="apple-touch-icon" sizes="180x180"
                      href="favicon/apple-touch-icon.png"/>

                <link rel="icon" type="image/png" sizes="32x32"
                      href="favicon/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16"
                      href="favicon/favicon-16x16.png"/>
                <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#484848"/>
                <meta name="msapplication-TileColor" content="#2b5797"/>
                <meta name="theme-color" content="#000000"/>

                <link rel="manifest" href="manifest.json"/>

                <meta name="description"
                      content="The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps."/>
                <meta name="robots" content="index, archive, nofollow"/>

                <meta property="og:image"
                      content={`https://og-image.vercel.app/${encodeURI(
                          siteTitle
                      )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summary_large_image"/>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                      rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </Head>
            <header>
                <Navbar tabs={tabs}/>
            </header>
            <div className={"container-fluid my-2"}>
                {home ? <></> : (
                    <Link href={"/"}>
                        <a className={"mb-2"}>
                            ← go back
                        </a>
                    </Link>
                )}
                <main>{children}</main>
            </div>
            <Footer/>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                    crossOrigin="anonymous"/>
        </div>
    )
}