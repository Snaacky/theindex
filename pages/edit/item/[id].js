import Layout, {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {useSession} from "next-auth/client"
import Login from "../../../components/layout/Login"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getItem} from "../../../lib/db/items"
import {getColumns} from "../../../lib/db/columns"
import EditItem from "../../../components/edit/EditItem"
import {canEdit} from "../../../lib/session"
import NotAdmin from "../../../components/layout/NotAdmin"
import TableBoard from "../../../components/boards/TableBoard"
import {getTables} from "../../../lib/db/tables"

export default function EditorColumn({_id, tables, columns, item}) {
    const [session] = useSession()

    if (!session) {
        return <Login/>
    } else if (!canEdit(session)) {
        return <NotAdmin/>
    }

    let tablesWithItem = []
    if (_id !== "_new") {
        tablesWithItem = tables.filter(t => t.items.some(i => i === item._id))
    }

    return <Layout>
        <Head>
            <title>
                {(_id === "_new" ? "Create item" : "Edit item " + item.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {_id === "_new" ? "Create a new item" : <>
                            Edit item <Link href={"/item/" + item._id}>{item.name}</Link>
                        </>}
                        <span className={"float-end"}>
                            <Link href={"/items"}>
                                <a className={"btn btn-outline-secondary"}>
                                    Item manager
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    {_id !== "_new" ?
                        <small className={"text-muted"}>
                            ID: <code>{item._id}</code>
                        </small> : <></>}
                </div>
                {_id === "_new" ? <EditItem columns={columns}/> :
                    <EditItem _id={item._id} name={item.name} urls={item.urls} nsfw={item.nsfw}
                              description={item.description} data={item.data} columns={columns}/>
                }
            </div>
        </div>

        <h4>
            Tables with this item
        </h4>
        {typeof item !== "undefined" ?
            <TableBoard _id={item._id} tables={tablesWithItem} allTables={tables} canMove={false}
                        forceEditMode={true} updateURL={"/api/edit/item/tables"}/> :
            <div className={"text-muted"}>
                Table selection will be available once the tab has been created
            </div>
        }
    </Layout>
}

export async function getServerSideProps({params}) {
    const item = await getItem(params.id)
    if (!item && params.id !== "_new") {
        return {
            notFound: true
        }
    }

    return {
        props: {
            _id: params.id,
            tables: await getTables(),
            columns: await getColumns(),
            item: params.id === "_new" ? {} : item
        }
    }
}
