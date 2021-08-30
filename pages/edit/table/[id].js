import Layout, {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/layout/Login"
import {getTable, getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns"
import EditTable from "../../../components/edit/EditTable"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ColumnBoard from "../../../components/boards/ColumnBoard"
import {canEdit} from "../../../lib/session"
import NotAdmin from "../../../components/layout/NotAdmin"
import TabBoard from "../../../components/boards/TabBoard"

export default function EditorTable({_id, tabs, tables, columns, table}) {
    const [session] = useSession()

    if (!session) {
        return <Login/>
    } else if (!canEdit(session)) {
        return <NotAdmin/>
    }

    let tabsWithTable = []
    if (_id !== "_new") {
        table.columns = table.columns.map(c => columns.find(t => t._id === c))
        tabsWithTable = tabs.filter(t => t.tables.some(c => c._id === table._id))
    }

    return <Layout>
        <Head>
            <title>
                {(_id === "_new" ? "Create table" : "Edit table " + table.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {_id === "_new" ? "Create a new table" : <>
                            Edit table <Link href={"/table/" + table.urlId}>{table.name}</Link>
                        </>}
                        <span className={"float-end"}>
                            <Link href={"/tables"}>
                                <a className={"btn btn-outline-secondary"}>
                                    Table manager
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    {_id !== "_new" ?
                        <small className={"text-muted"}>
                            ID: <code>{table._id}</code>
                        </small> : <></>}
                </div>
                {_id === "_new" ? <EditTable tables={tables}/> :
                    <EditTable tables={tables} _id={table._id} urlId={table.urlId}
                               name={table.name} nsfw={table.nsfw} description={table.description}/>
                }
            </div>
        </div>

        <h4>
            Tabs with this table
        </h4>
        {_id !== "_new" ?
            <TabBoard _id={table._id} tabs={tabsWithTable} allTabs={tabs} canMove={false}
                      updateURL={"/api/edit/table/tabs"} deleteURL={""} forceEditMode={true}/> :
            <div className={"text-muted"}>
                Tab selection will be available once the table has been created
            </div>
        }

        <h4>
            Columns used in this table
        </h4>
        {_id !== "_new" ?
            <ColumnBoard _id={table._id} columns={table.columns} allColumns={columns} canMove={false}
                         forceEditMode={true}/> :
            <div className={"text-muted"}>
                Column selection will be available once the table has been created
            </div>
        }
    </Layout>
}

export async function getServerSideProps({params}) {
    let table = {}
    if (params.id !== "_new") {
        table = await getTable(params.id)
        if (!table) {
            return {
                notFound: true
            }
        }
    }

    return {
        props: {
            _id: params.id,
            tabs: await getTabsWithTables(),
            tables: await getTables(),
            columns: await getColumns(),
            table
        }
    }
}
