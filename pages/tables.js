import Layout, {siteName} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import React from "react"
import {getTables} from "../lib/db/tables"
import IconTable from "../components/icons/IconTable"
import TableBoard from "../components/boards/TableBoard"

export default function EditorTables({tabs, tables}) {

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Table manager | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTable/> All tables
                </h2>
            </div>
        </div>

        <TableBoard tables={tables} deleteURL={"/api/delete/table"}/>
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            tables: await getTables()
        },
        revalidate: 10
    }
}
