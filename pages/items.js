import Layout, {siteTitle} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import React from "react"
import IconItem from "../components/icons/IconItem"
import {getItems} from "../lib/db/items"
import ItemBoard from "../components/boards/ItemBoard"
import {getColumns} from "../lib/db/columns"

export default function EditorItems({tabs, items, columns}) {

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Item manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconItem/> All items
                </h2>
            </div>
        </div>

        <ItemBoard items={items} deleteURL={"/api/delete/item"} columns={columns}/>
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            items: await getItems(),
            columns: await getColumns()
        },
        revalidate: 20
    }
}
