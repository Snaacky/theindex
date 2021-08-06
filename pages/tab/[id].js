import Layout, {siteTitle} from '../../components/layout/layout'
import Head from 'next/head'
import Link from 'next/link'
import {getTabs, getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/client'
import Loader from "../../components/loading"
import TableCard from "../../components/cards/TableCard";
import {canEdit} from "../../lib/session";
import IconAdd from "../../components/icons/IconAdd";
import IconEdit from "../../components/icons/IconEdit";

export default function Post({tabs, tab}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {tab.title + " | " + siteTitle}
            </title>
            <meta name="description" content={tab.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {tab.title}
                        {canEdit(session) ? <Link href={"/edit/tab/" + tab.url_id}>
                            <a title={"Edit tab"}>
                                <IconEdit size={24}/>
                            </a>
                        </Link> : ""}
                    </h2>
                </div>
                <p className={"card-text"}>
                    {tab.description}
                </p>
            </div>
        </div>

        <div className={"d-flex flex-wrap"}>
            {tab.tables.map(t => {
                return <TableCard table={t} key={t.url_id}/>
            })}
            {canEdit(session) ? <div className={"card bg-2 mb-2 me-2"} style={{width: "24rem"}}>
                <div className="row g-0">
                    <div className="col-auto p-1">
                        <Link href={"/add/table"}>
                            <a title={"Create a new table"} style={{
                                display: "block",
                                height: "128px",
                                width: "128px",
                            }}>
                                <IconAdd size={32}/>
                            </a>
                        </Link>
                    </div>
                    <div className="col">
                        <div className={"card-body"}>
                            <h5 className={"card-title"}>
                                Create new table
                            </h5>
                        </div>
                    </div>
                </div>
            </div> : ""}
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const tabs = await getTabs()
    const paths = tabs.map(tab => {
        return {
            params: {
                id: tab.url_id
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
    const tab = tabs.filter(t => t.url_id === params.id)[0]
    if (!tab) {
        return {
            notFound: true,
            revalidate: 60
        }
    }

    return {
        props: {tabs, tab},
        revalidate: 60
    };
}
