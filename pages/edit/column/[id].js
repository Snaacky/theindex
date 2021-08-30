import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {useSession} from "next-auth/client"
import Login from "../../../components/layout/Login"
import {getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumn, getColumns} from "../../../lib/db/columns"
import EditColumn from "../../../components/edit/EditColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../../lib/session"
import NotAdmin from "../../../components/layout/NotAdmin"
import TableBoard from "../../../components/boards/TableBoard"

export default function EditorColumn({_id, tables, columns, column}) {
    const [session] = useSession()

    if (!session) {
        return <Login/>
    } else if (!canEdit(session)) {
        return <NotAdmin/>
    }

    let tablesWithColumn = []
    if (_id !== "_new") {
        tablesWithColumn = tables.filter(t => t.columns.some(c => c === column._id))
    }
    return <>
        <Head>
            <title>
                {(_id === "_new" ? "Create column" : "Edit column " + column.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {_id === "_new" ? "Create a new column" : <>
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
                    {_id !== "_new" ?
                        <small className={"text-muted"}>
                            ID: <code>{column._id}</code>
                        </small> : <></>}
                </div>
                {_id === "_new" ? <EditColumn columns={columns}/> :
                    <EditColumn columns={columns} _id={column._id} urlId={column.urlId} name={column.name}
                                nsfw={column.nsfw} description={column.description} type={column.type}
                                values={column.values}/>
                }

            </div>
        </div>

        <h4>
            Tables with this column
        </h4>
        {_id !== "_new" ?
            <TableBoard _id={column._id} tables={tablesWithColumn} allTables={tables} canMove={false}
                        updateURL={"/api/edit/column/tables"} forceEditMode={true}/> :
            <div className={"text-muted"}>
                Table selection will be available once the column has been created
            </div>
        }
    </>
}

export async function getServerSideProps({params}) {
    let column = {}
    if (params.id !== "_new") {
        column = await getColumn(params.id)
        if (!column) {
            return {
                notFound: true
            }
        }
    }

    return {
        props: {
            _id: params.id,
            tables: await getTables(),
            columns: await getColumns(),
            column
        }
    }
}
