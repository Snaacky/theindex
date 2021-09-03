import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconItem from "../components/icons/IconItem"
import ItemBoard from "../components/boards/ItemBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getItems} from "../lib/db/items"

export default function Items({items: staticItems}) {
    const [session] = useSession()
    let {data: items, error} = useSWR("/api/items")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    items = items || staticItems

    return <>
        <Head>
            <title>
                {"All items | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Items on The Anime Index"}/>
            <meta name="twitter:description" content={"View all indexed sites"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconItem/> All items
                </h2>
            </div>
        </div>

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
