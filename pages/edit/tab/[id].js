import Layout, {siteTitle} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/Login"
import {getTables} from "../../../lib/db/tables"
import EditTab from "../../../components/edit/EditTab"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../../lib/session";
import NotAdmin from "../../../components/NotAdmin";

export default function EditorTab({urlId, tabs, tables}) {
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

    let tab
    if (urlId !== "_new") {
        tab = tabs.find(t => t.urlId === urlId)
    }
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(typeof tab === "undefined" ? "Create tab" : "Edit tab " + tab.title) + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {typeof tab === "undefined" ? "Create a new tab" : <>
                            Edit tab <Link href={"/tab/" + tab.urlId}>{tab.title}</Link>
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
                    <EditTab tabs={tabs} tablesDatalist={tables} _id={tab._id} urlId={tab.urlId} title={tab.title}
                             nsfw={tab.nsfw} description={tab.description} tables={tab.tables}/>
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
        }
    }
}
