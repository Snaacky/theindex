import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconTable from "../components/icons/IconTable"
import TableBoard from "../components/boards/TableBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getTables} from "../lib/db/tables"

export default function Tables({tables: staticTables}) {
    const [session] = useSession()
    let {data: tables, error} = useSWR("/api/tables")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    tables = tables || staticTables

    return <>
        <Head>
            <title>
                {"All tables | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Tables on The Anime Index"}/>
            <meta name="twitter:description" content={"View all curated tables of sites"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTable/> All tables
                </h2>
            </div>
        </div>

        <TableBoard tables={tables} updateURL={""} deleteURL={"/api/delete/table"} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticProps() {
    const tables = await getTables()
    return {
        props: {
            tables
        },
        revalidate: 30
    }
}
