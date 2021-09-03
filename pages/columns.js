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

export default function Columns({columns: staticColumns}) {
    const [session] = useSession()
    let {data: columns, error} = useSWR("/api/columns")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    columns = columns || staticColumns

    return <>
        <Head>
            <title>
                {"All columns | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Custom user lists on The Anime Index"}/>
            <meta name="twitter:description" content={"View all created user lists"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconColumn/> All columns
                </h2>
            </div>
        </div>

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
