import Layout, {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getTabs, getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import TableBoard from "../../components/boards/TableBoard"
import {getTables} from "../../lib/db/tables"

export default function Tab({tabs, tab, tables}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {tab.name + " | " + siteName}
            </title>
            <meta name="description" content={tab.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {tab.name}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {tab.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                            {canEdit(session) ? <Link href={"/edit/tab/" + tab.urlId}>
                                <a title={"Edit tab"} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link> : <></>}
                        </span>
                    </h2>
                </div>
                <p className={"card-text"}>
                    {tab.description}
                </p>
            </div>
        </div>

        <TableBoard _id={tab._id} tables={tab.tables} allTables={tables} key={tab._id}/>
    </Layout>
}

export async function getStaticPaths() {
    const tabs = await getTabs()
    const paths = tabs.map(tab => {
        return {
            params: {
                id: tab.urlId
            }
        }
    })

    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({params}) {
    const tabs = await getTabsWithTables()
    const tab = tabs.filter(t => t.urlId === params.id)[0]
    if (!tab) {
        return {
            notFound: true,
            revalidate: 10
        }
    }

    return {
        props: {
            tabs,
            tab,
            tables: await getTables()
        },
        revalidate: 10
    }
}
