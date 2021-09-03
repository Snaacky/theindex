import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import IconTab from "../components/icons/IconTab"
import React from "react"
import TabBoard from "../components/boards/TabBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getTabs} from "../lib/db/tabs"

export default function Tabs({tabs: staticTabs}) {
    const [session] = useSession()
    let {data: tabs, error} = useSWR("/api/tabs")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    tabs = tabs || staticTabs

    return <>
        <Head>
            <title>
                {"All tabs | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Tabs on The Anime Index"}/>
            <meta name="twitter:description" content={"View all collection of tables"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTab/> All tabs
                </h2>
            </div>
        </div>

        <TabBoard tabs={tabs} canEdit={isEditor(session)}/>
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
