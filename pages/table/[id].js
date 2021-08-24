import Layout, {siteTitle} from "../../components/layout/layout"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import Loader from "../../components/loading"
import {getTables, getTableWithColumnsAndItems} from "../../lib/db/tables"
import Head from "next/head"
import Link from "next/link"
import {getByUrlId} from "../../lib/db/db"
import ColumnFilter from "../../components/column-filter"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import ItemCard from "../../components/cards/ItemCard";

export default function Post({tabs, table}) {
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

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title row"}>
                    <div className={"col d-flex align-items-center"}>
                        <h3>
                            {table.title}
                            {canEdit(session) ? <Link href={"/edit/table/" + table.urlId}>
                                <a title={"Edit table"}>
                                    <IconEdit size={24}/>
                                </a>
                            </Link> : ""}
                        </h3>
                        <div className={"mx-2"}>
                            {tabsContainingTable.map(t => {
                                return <Link href={"/tab/" + t.urlId} key={t._id}>
                                    <a title={"View tab " + t.title}>
                                        <div className={"badge rounded-pill bg-primary me-2"}>
                                            {t.title}
                                        </div>
                                    </a>
                                </Link>
                            })}
                        </div>
                    </div>
                    <div className={"col-12 col-md-auto d-flex"}>
                        {canEdit(session) ?
                            <Link href={"/edit/table/" + table.urlId}>
                                <a className={"btn btn-outline-warning me-2"}>
                                    <IconEdit/> Items
                                </a>
                            </Link> : <></>
                        }
                        <button className={"btn btn-outline-primary"} type={"button"}
                                data-bs-toggle={"collapse"} data-bs-target={"#collapseFilter-" + table.urlId}
                                aria-expanded="false" aria-controls={"collapseFilter-" + table.urlId}>
                            Filter
                        </button>
                    </div>
                </div>
                <p className={"card-text"}>
                    {table.description}
                </p>
                <div id={"collapseFilter-" + table.urlId}
                     className="collapse row g-3">
                    <ColumnFilter columns={table.columns} onChange={console.log}/>
                </div>
            </div>
        </div>
        <div className={"d-flex flex-wrap mt-2"}>
            {table.items.length === 0 ? <span className={"text-muted"}>No items found</span> : <></>}
            {table.items.map(i => {
                return <ItemCard item={i} columns={table.columns} key={i._id}/>
            })}
        </div>
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

    return {
        props: {tabs, table},
        revalidate: 60
    }
}
