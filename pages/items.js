import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconItem from "../components/icons/IconItem"
import ItemBoard from "../components/boards/ItemBoard"
import useSWR from "swr"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getItems} from "../lib/db/items"
import DataBadge from "../components/data/DataBadge"

export default function Items({items: staticItems}) {
    const [session] = useSession()
    let {data: items} = useSWR("/api/items")
    items = items || staticItems

    const description = "Every item contains infos like the language or feature a site or service has"
    return <>
        <Head>
            <title>
                {"All items | " + siteName}
            </title>
            <meta name={"description"} content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Items on The Anime Index"}/>
            <meta name="twitter:description" content={"View all indexed sites"}/>
        </Head>


        <h2>
            <IconItem/> All items
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge name={items.length + " item" + (items.length !== 1 ? "s" : "")} style={"primary"}/>
            </div>
        </h2>
        <p>
            {description}
        </p>

        <ItemBoard items={items} deleteURL={"/api/delete/item"} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticProps() {
    const items = await getItems()
    return {
        props: {
            items
        },
        revalidate: 30
    }
}
