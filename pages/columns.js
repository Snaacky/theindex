import Head from "next/head"
import React from "react"
import IconColumn from "../components/icons/IconColumn"
import ColumnBoard from "../components/boards/ColumnBoard"
import useSWR from "swr"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getColumns} from "../lib/db/columns"
import DataBadge from "../components/data/DataBadge"

const title = "Custom user lists on The Anime Index"
const description = "Items can have different data-fields for different attributes. We call such fields columns like you use to in a table"

export default function Columns({columns: staticColumns}) {
    const [session] = useSession()
    let {data: columns} = useSWR("/api/columns")
    columns = columns || staticColumns

    return <>
        <Head>
            <title>
                {"All columns | " + process.env.NEXT_PUBLIC_SITE_NAME}
            </title>

            <meta property="og:title" content={title}/>
            <meta name="twitter:title" content={title}/>

            <meta name="description" content={description}/>
            <meta property="og:description" content={description}/>
            <meta name="twitter:description" content={description}/>

            <meta name="twitter:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
            <meta property="og:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
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
