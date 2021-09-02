import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconItem from "../components/icons/IconItem"
import ItemBoard from "../components/boards/ItemBoard"
import Loader from "../components/loading"
import useSWR from "swr"
import Error from "./_error"

export default function EditorItems() {
    const {data: items, error} = useSWR("/api/items")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!items) {
        return <Loader/>
    }

    return <>
        <Head>
            <title>
                {"All items | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconItem/> All items
                </h2>
            </div>
        </div>

        <ItemBoard items={items} deleteURL={"/api/delete/item"}/>
    </>
}

export async function getStaticProps() {
    return {
        props: {},
        revalidate: 10
    }
}
