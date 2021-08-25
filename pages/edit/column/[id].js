import Layout, {siteTitle} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/Login"
import {getTables} from "../../../lib/db/tables"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns"
import EditColumn from "../../../components/edit/EditColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../../lib/session";
import NotAdmin from "../../../components/NotAdmin";

export default function EditorColumn({urlId, tabs, columns}) {
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

    let column
    if (urlId !== "_new") {
        column = columns.find(t => t.urlId === urlId)
    }
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(typeof column === "undefined" ? "Create column" : "Edit column " + column.title) + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {typeof column === "undefined" ? "Create a new column" : <>
                            Edit column <Link href={"/column/" + column.urlId}>{column.title}</Link>
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
                    <EditColumn columns={columns} _id={column._id} urlId={column.urlId} title={column.title}
                                nsfw={column.nsfw} description={column.description} type={column.type}
                                values={column.values}/>
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
