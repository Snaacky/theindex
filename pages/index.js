import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import Layout, {siteTitle} from "../components/layout/layout"
import {images} from "../lib/icon";
import {getTabsWithTables} from "../lib/db/tabs"

export default function Home({tabs, images}) {
    return (
        <Layout tabs={tabs}>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <div className={"container"}>
                <h1 className={"mb-2"}>
                    You are searching a site with:
                </h1>
                <div className={"gx-4"}>
                    {tabs.map(({urlId, title}) => {
                        return (
                            <Link href={"/tab/" + urlId} key={urlId}>
                                <a type={"button"} className={"btn btn-lg btn-outline-primary me-3"}>
                                    {title}
                                </a>
                            </Link>
                        )
                    })}
                </div>
                <div className={"my-4"}>
                    This service is still under construction, content is coming soon™
                </div>
                Emoji dump:
                <div>
                    {images.map(i =>
                        <div className={"m-1 d-inline-flex"} key={i}>
                            <Image width={64} height={64} src={i} alt={""}
                                   className={"rounded"}/>
                        </div>
                    )}
                </div>
                <div className={"my-4"}>
                    I placed the button here for now, as I have not really thought about where else to put them...
                    <br/>
                    <a className={"btn btn-outline-secondary"} href={"/api/export"} target={"_blank"} rel="noreferrer">
                        Export all data
                    </a>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const tabs = await getTabsWithTables()
    return {
        props: {tabs, images: images()},
        revalidate: 60
    }
}
