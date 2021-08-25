import Head from "next/head"
import Image from "next/image"
import Layout, {siteTitle} from "../components/layout/Layout"
import {images} from "../lib/icon"
import {getTabsWithTables} from "../lib/db/tabs"

export default function Admin({tabs, images}) {
    return (
        <Layout tabs={tabs}>
            <Head>
                <title>Admin | {siteTitle}</title>
            </Head>

            <div className={"mb-4"}>
                I placed the button here for now, as I have not really thought about where else to put them...
                <br/>
                <a className={"btn btn-outline-secondary"} href={"/api/export"} target={"_blank"} rel="noreferrer">
                    Export all data
                </a>
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
        </Layout>
    )
}

export async function getStaticProps() {
    const tabs = await getTabsWithTables()
    return {
        props: {
            tabs,
            images: images()
        },
        revalidate: 20
    }
}
