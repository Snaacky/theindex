import Layout, {siteTitle} from "../../../components/layout/layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/Login"
import {getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns";
import EditTable from "../../../components/edit/EditTable";

export default function EditorTable({urlId, tabs, tables, columns}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    let table
    if (urlId !== "_new") {
        table = tables.find(t => t.urlId === urlId)
    }
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(typeof table === "undefined" ? "Create table" : "Edit table " + table.title) + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {typeof table === "undefined" ? "Create a new table" : <>
                            Edit table <Link href={"/table/" + table.urlId}>{table.title}</Link>
                        </>}
                    </h2>
                    {typeof table !== "undefined" ?
                        <small className={"text-muted"}>
                            ID: <code>{table._id}</code>
                        </small> : <></>}
                </div>
                {typeof table === "undefined" ? <EditTable tables={tables} columnsDatalist={columns}/> :
                    <EditTable tables={tables} columnsDatalist={columns} _id={table._id} urlId={table.urlId}
                               title={table.title} nsfw={table.nsfw} description={table.description}
                               columns={table.columns}/>
                }
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps({params}) {
    return {
        props: {
            urlId: params.id,
            tabs: await getTabsWithTables(),
            tables: await getTables(),
            columns: await getColumns()
        }
    }
}