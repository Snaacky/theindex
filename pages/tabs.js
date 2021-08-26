import Layout, {siteName} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import IconTab from "../components/icons/IconTab"
import React from "react"
import TabBoard from "../components/boards/TabBoard"

export default function EditorTabs({tabs}) {

    return <Layout tabs={tabs}>
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
        props: {
            tabs: await getTabsWithTables()
        },
        revalidate: 10
    }
}
