import Layout, {siteTitle} from '../../../components/layout/layout'
import Head from 'next/head'
import {getTabsWithTables} from "../../../lib/db/tabs";
import {useSession} from 'next-auth/client'
import Login from "../../../components/Login";
import {getTables} from "../../../lib/db/tables";
import EditTab from "../../../components/edit/EditTab";
import Link from 'next/link'

export default function EditorTab({url_id, tabs, tables}) {
    const [session] = useSession()
    console.log("Muhahah", url_id, session, tabs)

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    let tab = url_id === "_new" ? undefined : tabs.find(t => t.url_id === url_id)

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {(tab === undefined ? "Create tab" : "Edit tab " + tab.title) + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {tab === undefined ? "Create a new tab" : <>
                            Edit tab <Link href={"/tab/" + tab.url_id}>{tab.title}</Link>
                        </>}
                    </h2>
                    {tab !== undefined ?
                        <small className={"text-muted"}>
                            ID: <code>{tab._id}</code>
                        </small> : <></>}
                </div>
                {tab === undefined ? <EditTab tabs={tabs} tables_datalist={tables}/> :
                    <EditTab tabs={tabs} tables_datalist={tables} _id={tab._id} url_id={tab.url_id} title={tab.title}
                             nsfw={tab.nsfw} description={tab.description} tables={tab.tables}/>
                }
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps({params}) {
    return {
        props: {
            url_id: params.id,
            tabs: await getTabsWithTables(),
            tables: await getTables(),
        }
    }
}
