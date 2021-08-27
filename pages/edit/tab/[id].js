import Layout, {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/layout/Login"
import {getTables} from "../../../lib/db/tables"
import EditTab from "../../../components/edit/EditTab"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../../lib/session"
import NotAdmin from "../../../components/layout/NotAdmin"
import TableBoard from "../../../components/boards/TableBoard"
import {getByUrlId} from "../../../lib/db/db"

export default function EditorTab({urlId, tabs, tables}) {
    const [session] = useSession()

    if (!session) {
        return <Login/>
    } else if (!canEdit(session)) {
        return <NotAdmin/>
    }

    let tab
    if (urlId !== "_new") {
        tab = tabs.find(t => t.urlId === urlId)
    }
    return <Layout>
        <Head>
            <title>
                {(typeof tab === "undefined" ? "Create tab" : "Edit tab " + tab.name) + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {typeof tab === "undefined" ? "Create a new tab" : <>
                            Edit tab <Link href={"/tab/" + tab.urlId}>{tab.name}</Link>
                        </>}
                        <span className={"float-end"}>
                            <Link href={"/tabs"}>
                                <a className={"btn btn-outline-secondary"}>
                                    Tab manager
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    {typeof tab !== "undefined" ?
                        <small className={"text-muted"}>
                            ID: <code>{tab._id}</code>
                        </small> : <></>}
                </div>
                {typeof tab === "undefined" ? <EditTab tabs={tabs} tablesDatalist={tables}/> :
                    <EditTab tabs={tabs} tablesDatalist={tables} _id={tab._id} urlId={tab.urlId} name={tab.name}
                             nsfw={tab.nsfw} description={tab.description} tables={tab.tables}/>
                }
            </div>
        </div>

        <h4>
            Tables used in this tab
        </h4>
        {typeof tab !== "undefined" ?
            <TableBoard _id={tab._id} tables={tab.tables} allTables={tables} canMove={false}
                        forceEditMode={true}/> :
            <div className={"text-muted"}>
                Table selection will be available once the tab has been created
            </div>
        }
    </Layout>
}

export async function getServerSideProps({params}) {
    const tab = await getByUrlId("tabs", params.id)
    if (!tab && params.id !== "_new") {
        return {
            notFound: true
        }
    }

    return {
        props: {
            urlId: params.id,
            tabs: await getTabsWithTables(),
            tables: await getTables(),
        }
    }
}
