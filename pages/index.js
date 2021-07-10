import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout, {siteTitle} from '../components/layout/layout'
import {getTabsWithTables} from "../lib/db/tabs"

export default function Home({tabs}) {
    return (
        <Layout home tabs={tabs}>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <div className={"container"}>
                <h1 className={"mb-2"}>
                    You are searching a site with:
                </h1>
                <div className={"gx-4"}>
                    {tabs.map(({url_id, title}) => {
                        return (
                            <Link href={"/tab/" + url_id} key={url_id}>
                                <a type={"button"} className={"btn btn-lg btn-outline-primary me-3"}>
                                    {title}
                                </a>
                            </Link>
                        )
                    })}
                </div>
                <div className={"my-4"}>
                    This service is still under construction, content is coming soon™
                    <br/>
                    <Image width={48} height={48} src={"/img/hinanope.gif"} alt={""}/>
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
        props: {tabs},
        revalidate: 60
    }
}
