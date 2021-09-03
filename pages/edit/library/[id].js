import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getLibrariesWithTables, getLibrary} from "../../../lib/db/libraries"
import {getTables} from "../../../lib/db/tables"
import EditLibrary from "../../../components/edit/EditLibrary"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import TableBoard from "../../../components/boards/TableBoard"

export default function EditorLibrary({_id, libraries, tables, library}) {
    return <>
        <Head>
            <title>
                {(_id === "_new" ? "Create tab" : "Editlibrary" + library.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {_id === "_new" ? "Create a new library" : <>
                            Edit library <Link href={"/library/" + library.urlId}>{library.name}</Link>
                        </>}
                        <span className={"float-end"}>
                            <Link href={"/libraries"}>
                                <a className={"btn btn-outline-secondary"}>
                                    All libraries
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    {_id !== "_new" ?
                        <small className={"text-muted"}>
                            ID: <code>{library._id}</code>
                        </small> : <></>}
                </div>
                {_id === "_new" ? <EditLibrary libraries={libraries} tablesDatalist={tables}/> :
                    <EditLibrary libraries={libraries} tablesDatalist={tables} _id={library._id} urlId={library.urlId}
                                 name={library.name}
                                 nsfw={library.nsfw} description={library.description} tables={library.tables}/>
                }
            </div>
        </div>

        <h4>
            Tables used in this library
        </h4>
        {_id !== "_new" ?
            <TableBoard _id={library._id} tables={library.tables} allTables={tables} canMove={false} canEdit={true}
                        forceEditMode={true}/> :
            <div className={"text-muted"}>
                Table selection will be available once the library has been created
            </div>
        }
    </>
}

EditorLibrary.auth = {
    requireEditor: true
}

export async function getServerSideProps({params}) {
    let library = {}
    if (params.id !== "_new") {
        library = await getLibrary(params.id)
        if (!library) {
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
            library
        }
    }
}
