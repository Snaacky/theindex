import Layout, {siteName} from "../../components/layout/Layout"
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
import {useState} from "react"
import DataItem from "../../components/data/DataItem"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DataBadge from "../../components/data/DataBadge"

export default function Column({tabs, itemsContainingColumn, column, columns}) {
    const router = useRouter()
    const [session] = useSession()

    const [filter, setFilter] = useState(null)

    if (router.isFallback) {
        return <Loader/>
    }


    const filteredItems = itemsContainingColumn.filter(i => {
        if (filter === null) {
            return true
        }

        if (column.type === "array") {
            return filter.length === 0 || filter.every(ii => i.data[column._id].includes(ii))
        } else if (column.type === "bool") {
            return i.data[column._id] === filter
        }
        return filter === "" || i.data[column._id].toLowerCase().includes(filter.toLowerCase())
    })

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {column.name + " | " + siteName}
            </title>
            <meta name="description" content={column.description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title row"}>
                    <h3>
                        {column.name}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {column.nsfw ? <DataBadge data={false} title={"NSFW"}/> : <></>}
                            {canEdit(session) ? <Link href={"/edit/column/" + column.urlId}>
                                <a className={"ms-2"} title={"Edit column"}>
                                    <IconEdit/>
                                </a>
                            </Link> : ""}
                        </span>
                    </h3>
                </div>
                <p className={"card-text"}>
                    {column.description}
                </p>
                <div>
                    <span className={"me-2"}>
                        <FontAwesomeIcon icon={["fas", "filter"]}/> Filter:
                    </span>
                    {column.type === "array" || column.type === "bool" ?
                        <DataItem data={filter} column={column} title={column.name} onChange={setFilter}/> : <></>
                    }
                </div>
            </div>
        </div>

        <div className={"d-flex flex-wrap mt-2"}>
            {filteredItems.length === 0 ? <span className={"text-muted"}>No items found</span> : <></>}
            {filteredItems.map(i => {
                return <ItemCard item={i} columns={columns} key={i._id}/>
            })}
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const columns = await getColumns() || []
    const paths = columns.map(i => {
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
    const columns = await getColumns() || []
    const column = await getByUrlId("columns", params.id)

    let query = {}
    query["data." + column._id] = {$exists: true}
    const itemsContainingColumn = await find("items", query) || []

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
