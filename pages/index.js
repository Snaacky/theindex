import Head from "next/head"
import Link from "next/link"
import Layout, {siteName} from "../components/layout/Layout"
import {getTabsWithTables} from "../lib/db/tabs"

export default function Home({tabs}) {
    return (
        <Layout tabs={tabs}>
            <Head>
                <title>{siteName}</title>
            </Head>

            <div className={"container"}>
                <h1 className={"mb-2"}>
                    You are searching a site with:
                </h1>
                <div className={"gx-4"}>
                    {tabs.map(({urlId, name}) => {
                        return (
                            <Link href={"/tab/" + urlId} key={urlId}>
                                <a className={"btn btn-lg btn-outline-primary me-3 mb-2"}>
                                    {name}
                                </a>
                            </Link>
                        )
                    })}
                </div>
                <div className={"my-4"}>
                    This service is still under construction, content is coming soon™
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const tabs = await getTabsWithTables()
    return {
        props: {tabs},
        revalidate: 10
    }
}
