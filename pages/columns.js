import Layout, {siteTitle} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../components/Login"
import React from "react"
import {getColumns} from "../lib/db/columns"
import IconColumn from "../components/icons/IconColumn"
import ColumnBoard from "../components/boards/ColumnBoard"

export default function EditorColumns({tabs, columns}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Column manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconColumn/> All columns
                </h2>
            </div>
        </div>

        <ColumnBoard columns={columns} deleteURL={"/api/delete/column"}/>
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            columns: await getColumns()
        },
        revalidate: 20
    }
}
