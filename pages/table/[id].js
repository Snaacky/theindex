import Layout, {siteTitle} from "../../components/layout/Layout"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import Loader from "../../components/loading"
import {getTables, getTableWithColumnsAndItems} from "../../lib/db/tables"
import Head from "next/head"
import Link from "next/link"
import {getByUrlId} from "../../lib/db/db"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import ItemCardsBoard from "../../components/layout/ItemCardsBoard"
import {getItems} from "../../lib/db/items"
import DataBadge from "../../components/data/DataBadge";

export default function Table({tabs, table, items}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    const tabsContainingTable = tabs.filter(tab => tab.tables.some(t => t._id === table._id))

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {table.title + " | " + siteTitle}
            </title>
            <meta name="description" content={table.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h3>
                        {table.title}
                        <span style={{fontSize: "1.2rem"}}>
                            {tabsContainingTable.map(t => {
                                return <Link href={"/tab/" + t.urlId} key={t._id}>
                                    <a title={"View tab " + t.title}>
                                        <div className={"badge rounded-pill bg-primary mx-2"}>
                                            {t.title}
                                        </div>
                                    </a>
                                </Link>
                            })}
                            <div className={"float-end"}>
                                {table.nsfw ? <DataBadge data={false} title={"NSFW"}/> : <></>}
                                {canEdit(session) ? <Link href={"/edit/table/" + table.urlId}>
                                    <a title={"Edit table"} className={"ms-2"}>
                                        <IconEdit/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                    </h3>
                </div>
                <p className={"card-text"}>
                    {table.description}
                </p>
            </div>
        </div>
        <ItemCardsBoard session={session} _id={table._id} items={table.items} allItems={items} columns={table.columns}/>
    </Layout>
}

export async function getStaticPaths() {
    const tables = await getTables()
    const paths = tables.map(table => {
        return {
            params: {
                id: table.urlId
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
    const table = await getTableWithColumnsAndItems(await getByUrlId("tables", params.id))
    const items = await getItems()

    return {
        props: {
            tabs,
            table,
            items,
        },
        revalidate: 60
    }
}
