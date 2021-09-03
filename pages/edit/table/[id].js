import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getLibrariesWithTables} from "../../../lib/db/libraries"
import {getTable, getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns"
import EditTable from "../../../components/edit/EditTable"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ColumnBoard from "../../../components/boards/ColumnBoard"
import LibraryBoard from "../../../components/boards/LibraryBoard"

export default function EditorTable({_id, libraries, tables, columns, table}) {
    let librariesWithTable = []
    if (_id !== "_new") {
        table.columns = table.columns.map(c => columns.find(t => t._id === c))
        librariesWithTable = libraries.filter(t => t.tables.some(c => c._id === table._id))
    }

    return <>
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
                                    All tables
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
            Libraries with this table
        </h4>
        {_id !== "_new" ?
            <LibraryBoard _id={table._id} libraries={librariesWithTable} allLibraries={libraries} canMove={false} canEdit={true}
                          updateURL={"/api/edit/table/libraries"} deleteURL={""} forceEditMode={true}/> :
            <div className={"text-muted"}>
               Libraryselection will be available once the table has been created
            </div>
        }

        <h4>
            Columns used in this table
        </h4>
        {_id !== "_new" ?
            <ColumnBoard _id={table._id} columns={table.columns} allColumns={columns} canMove={false} canEdit={true}
                         forceEditMode={true}/> :
            <div className={"text-muted"}>
                Column selection will be available once the table has been created
            </div>
        }
    </>
}

EditorTable.auth = {
    requireEditor: true
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
            libraries: await getLibrariesWithTables(),
            tables: await getTables(),
            columns: await getColumns(),
            table
        }
    }
}
