import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconTable from "../components/icons/IconTable"
import TableBoard from "../components/boards/TableBoard"
import Loader from "../components/loading"
import useSWR from "swr"
import Error from "./_error"

export default function EditorTables() {
    const {data: tables, error} = useSWR("/api/tables")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!tables) {
        return <Loader/>
    }

    return <>
        <Head>
            <title>
                {"All tables | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTable/> All tables
                </h2>
            </div>
        </div>

        <TableBoard tables={tables} updateURL={""} deleteURL={"/api/delete/table"}/>
    </>
}

export async function getStaticProps() {
    return {
        props: {},
        revalidate: 10
    }
}
