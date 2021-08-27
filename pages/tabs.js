import Layout, {siteName} from "../components/layout/Layout"
import Head from "next/head"
import IconTab from "../components/icons/IconTab"
import React from "react"
import TabBoard from "../components/boards/TabBoard"
import useSWR from "swr"
import Loader from "../components/loading"
import Error from "./_error"

export default function EditorTabs() {
    const {data: tabs, error} = useSWR("/api/tabs")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!tabs) {
        return <Loader/>
    }

    return <Layout>
        <Head>
            <title>
                {"Tab manager | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTab/> All tabs
                </h2>
            </div>
        </div>

        <TabBoard tabs={tabs}/>
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {},
        revalidate: 10
    }
}
