import Head from "next/head"
import Link from "next/link"
import {siteName} from "../components/layout/Layout"
import useSWR from "swr"
import Error from "./_error"
import {getTabs} from "../lib/db/tabs"

export default function Home({tabs: staticTabs}) {
    let {data: tabs, error} = useSWR("/api/tabs")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    tabs = tabs || staticTabs

    return <>
        <Head>
            <title>{siteName}</title>
            <meta name="twitter:card" content="summary"/>
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
    </>
}

export async function getStaticProps() {
    const tabs = await getTabs()
    return {
        props: {
            tabs
        },
        revalidate: 30
    }
}
