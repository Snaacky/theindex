import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconColumn from "../components/icons/IconColumn"
import ColumnBoard from "../components/boards/ColumnBoard"
import Loader from "../components/loading"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"

export default function EditorColumns() {
    const [session] = useSession()
    const {data: columns, error} = useSWR("/api/columns")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!columns) {
        return <Loader/>
    }

    return <>
        <Head>
            <title>
                {"All columns | " + siteName}
            </title>
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
    return {
        props: {},
        revalidate: 10
    }
}
