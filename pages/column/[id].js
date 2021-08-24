import Layout, {siteTitle} from "../../components/layout/layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {canEdit} from "../../lib/session"
import {find, getByUrlId} from "../../lib/db/db"
import {getColumns} from "../../lib/db/columns"
import ItemCard from "../../components/cards/ItemCard"
import IconEdit from "../../components/icons/IconEdit"

export default function Column({tabs, itemsContainingColumn, column, columns}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {column.title + " | " + siteTitle}
            </title>
            <meta name="description" content={column.description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title row"}>
                    <div className={"col d-flex align-items-center"}>
                        <h3>
                            {column.title}
                            {canEdit(session) ? <Link href={"/edit/column/" + column.urlId}>
                                <a title={"Edit column"}>
                                    <IconEdit/>
                                </a>
                            </Link> : ""}
                        </h3>
                    </div>
                </div>
                <p className={"card-text"}>
                    {column.description}
                </p>
                <div className={"d-flex flex-wrap"}>
                    Aohoajfik asjfilasjf ilsafjasll {}
                </div>
            </div>
        </div>

        <div className={"d-flex flex-wrap mt-2"}>
            {itemsContainingColumn.length === 0 ? <span className={"text-muted"}>No items found</span> : <></>}
            {itemsContainingColumn.map(i => {
                return <ItemCard item={i} columns={columns} key={i._id}/>
            })}
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const items = await getColumns()
    const paths = items.map(i => {
        return {
            params: {
                id: i.urlId
            }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({params}) {
    const tabs = await getTabsWithTables()
    const columns = await getColumns()
    const column = await getByUrlId("columns", params.id)

    let query = {}
    if ('v' in params) {
        query["data." + column._id] = params.v
    } else if (column.type === "bool") {
        query["data." + column._id] = true
    } else {
        query["data." + column._id] = {$exists: true}
    }
    const itemsContainingColumn = await find("items", query)

    return {
        props: {
            tabs,
            itemsContainingColumn,
            column,
            columns
        },
        revalidate: 10
    }
}
