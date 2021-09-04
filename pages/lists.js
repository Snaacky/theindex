import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import useSWR from "swr"
import Error from "./_error"
import {getLists} from "../lib/db/lists"
import ListBoard from "../components/boards/ListBoard"
import IconList from "../components/icons/IconList"

export default function Lists({lists: staticLists}) {
    let {data: lists, error} = useSWR("/api/lists")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    lists = lists || staticLists

    const description = "User lists are created collections with user selected items, ranking and columns to display"
    return <>
        <Head>
            <title>
                {"All user lists | " + siteName}
            </title>
            <meta name={"description"} content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Custom user lists on The Anime Index"}/>
            <meta name="twitter:description" content={"View all created user lists"}/>
        </Head>

        <h2>
            <IconList/> All user lists
        </h2>
        <p>
            {description}
        </p>

        <ListBoard lists={lists}/>
    </>
}

export async function getStaticProps() {
    const lists = await getLists()
    return {
        props: {
            lists
        },
        revalidate: 30
    }
}
