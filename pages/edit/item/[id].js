import Layout, {siteTitle} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/Login"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getItem} from "../../../lib/db/items"
import {getColumns} from "../../../lib/db/columns"
import EditItem from "../../../components/edit/EditItem"
import {canEdit} from "../../../lib/session";
import NotAdmin from "../../../components/NotAdmin";

export default function EditorColumn({_id, tabs, columns, item}) {
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

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(_id === "_new" ? "Create item" : "Edit item " + item.title) + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {_id === "_new" ? "Create a new item" : <>
                            Edit item <Link href={"/item/" + item._id}>{item.title}</Link>
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
                    <EditItem _id={item._id} title={item.title} urls={item.urls} nsfw={item.nsfw}
                              description={item.description} data={item.data} columns={columns}/>
                }
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps({params}) {
    return {
        props: {
            _id: params.id,
            tabs: await getTabsWithTables(),
            columns: await getColumns(),
            item: params.id === "_new" ? {} : await getItem(params.id)
        }
    }
}
