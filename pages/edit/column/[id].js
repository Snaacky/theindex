import Layout, {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/layout/Login"
import {getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns"
import EditColumn from "../../../components/edit/EditColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../../lib/session"
import NotAdmin from "../../../components/layout/NotAdmin"
import TableBoard from "../../../components/boards/TableBoard"

export default function EditorColumn({urlId, tabs, tables, columns}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    if (!canEdit(session)) {
        return <Layout tabs={tabs}>
            <NotAdmin/>
        </Layout>
    }

    let column = [], tablesWithColumn = []
    if (urlId !== "_new") {
        column = columns.find(t => t.urlId === urlId)
        tablesWithColumn = tables.filter(t => t.columns.some(c => c === column._id))
    }
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(typeof column === "undefined" ? "Create column" : "Edit column " + column.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {typeof column === "undefined" ? "Create a new column" : <>
                            Edit column <Link href={"/column/" + column.urlId}>{column.name}</Link>
                        </>}
                        <span className={"float-end"}>
                            <Link href={"/columns"}>
                                <a className={"btn btn-outline-secondary"}>
                                    Column manager
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    {typeof column !== "undefined" ?
                        <small className={"text-muted"}>
                            ID: <code>{column._id}</code>
                        </small> : <></>}
                </div>
                {typeof column === "undefined" ? <EditColumn columns={columns}/> :
                    <EditColumn columns={columns} _id={column._id} urlId={column.urlId} name={column.name}
                                nsfw={column.nsfw} description={column.description} type={column.type}
                                values={column.values}/>
                }

            </div>
        </div>

        <h4>
            Tables with this column
        </h4>
        {typeof column !== "undefined" ?
            <TableBoard _id={column._id} tables={tablesWithColumn} allTables={tables} canMove={false}
                        updateURL={"/api/edit/column/tables"} forceEditMode={true}/> :
            <div className={"text-muted"}>
                Table selection will be available once the column has been created
            </div>
        }
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
