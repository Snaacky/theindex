import {siteName} from "../../components/layout/Layout"
import Loader from "../../components/loading"
import {getTables} from "../../lib/db/tables"
import Head from "next/head"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import ItemBoard from "../../components/boards/ItemBoard"
import useSWR from "swr"
import Error from "../_error"
import {getByUrlId} from "../../lib/db/db"

export default function Table({_id}) {
    const [session] = useSession()
    const {data: table, errorTable} = useSWR("/api/table/" + _id)
    const {data: tabs, errorTabs} = useSWR("/api/tabs")

    if (errorTable) {
        return <Error error={errorTable.status}/>
    } else if (errorTabs) {
        return <Error error={errorTabs.status}/>
    } else if (!table || !tabs) {
        return <Loader/>
    }

    const tabsContainingTable = tabs.filter(tab => tab.tables.some(t => t._id === table._id))

    return <>
        <Head>
            <title>
                {table.name + " | " + siteName}
            </title>
            <meta name="description" content={table.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h3>
                        {table.name}
                        <span style={{fontSize: "1.2rem"}}>
                            {tabsContainingTable.map(t => {
                                return <Link href={"/tab/" + t.urlId} key={t._id}>
                                    <a title={"View tab " + t.name}>
                                        <div className={"badge rounded-pill bg-primary mx-2"}>
                                            {t.name}
                                        </div>
                                    </a>
                                </Link>
                            })}
                            <div className={"float-end"}>
                                {table.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                                {canEdit(session) ? <Link href={"/edit/table/" + table._id}>
                                    <a title={"Edit table"} className={"ms-2"}>
                                        <IconEdit/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                    </h3>
                </div>
                <p className={"card-text"} style={{
                    whiteSpace: "pre-line"
                }}>
                    {table.description}
                </p>
            </div>
        </div>
        <ItemBoard _id={table._id} items={table.items} columns={table.columns} key={table._id}/>
    </>
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
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const table = await getByUrlId("tables", params.id)
    if (!table) {
        return {
            notFound: true,
            revalidate: 10
        }
    }

    return {
        props: {
            _id: table._id
        },
        revalidate: 10
    }
}
