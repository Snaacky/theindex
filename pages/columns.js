import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconColumn from "../components/icons/IconColumn"
import ColumnBoard from "../components/boards/ColumnBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getColumns} from "../lib/db/columns"
import DataBadge from "../components/data/DataBadge"

export default function Columns({columns: staticColumns}) {
    const [session] = useSession()
    let {data: columns, error} = useSWR("/api/columns")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    columns = columns || staticColumns

    const description = "Items can have different data-fields for different attributes. We call such fields columns like you use to in a table"
    return <>
        <Head>
            <title>
                {"All columns | " + siteName}
            </title>
            <meta name={"description"} content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Custom user lists on The Anime Index"}/>
            <meta name="twitter:description" content={"View all created user lists"}/>
        </Head>


        <h2>
            <IconColumn/> All columns
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge name={columns.length + " column" + (columns.length !== 1 ? "s" : "")} style={"primary"}/>
            </div>
        </h2>
        <p>
            {description}
        </p>


        <ColumnBoard columns={columns} updateURL={""} deleteURL={"/api/delete/column"} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticProps() {
    const columns = await getColumns()
    return {
        props: {
            columns
        },
        revalidate: 30
    }
}
