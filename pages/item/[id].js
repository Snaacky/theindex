import Layout, {siteTitle} from "../../components/layout/layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {canEdit} from "../../lib/session";
import IconEdit from "../../components/icons/IconEdit";
import {getItem, getItems} from "../../lib/db/items";
import {find} from "../../lib/db/db";
import {getColumns} from "../../lib/db/columns";
import DataItem from "../../components/data/data-item";

export default function Item({tabs, tablesContainingItem, columns, item}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    let columnYes = [], columnNo = [], columnArray = []
    Object.keys(item.data).forEach(key => {
        const c = columns.find(c => c._id === key)

        if (c.type === "bool") {
            if (item.data[key] === true) {
                columnYes.push(c)
            } else if (item.data[key] === false) {
                columnNo.push(c)
            }
        } else if (c.type === "array") {
            columnArray.push(c)
        } else {
            console.error("Unknown column type of ", c)
        }
    })


    return <Layout tabs={tabs}>
        <Head>
            <title>
                {item.title + " | " + siteTitle}
            </title>
            <meta name="description" content={item.description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title row"}>
                    <div className={"col d-flex align-items-center"}>
                        <h3>
                            {item.title}
                            {canEdit(session) ? <Link href={"/edit/item/" + item._id}>
                                <a title={"Edit table"}>
                                    <IconEdit size={24}/>
                                </a>
                            </Link> : ""}
                        </h3>
                        <div className={"mx-2"}>
                            {tablesContainingItem.map(t => {
                                return <Link href={"/table/" + t.urlId} key={t._id}>
                                    <a title={"View table " + t.title}>
                                        <div className={"badge rounded-pill bg-primary me-2"}>
                                            {t.title}
                                        </div>
                                    </a>
                                </Link>
                            })}
                        </div>
                    </div>
                </div>
                <p className={"card-text"}>
                    {item.description}
                </p>
            </div>
        </div>

        <div className={"card bg-2 my-2"}>
            <div className={"card-body"}>
                <h5 className={"card-title"}>
                    It has
                </h5>
                <div className={"d-flex flex-wrap"}>
                    {columnYes.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                    {columnYes.map(c => {
                        return <DataItem data={item.data[c._id]} column={c} key={c._id}/>
                    })}
                </div>
            </div>
        </div>
        <div className={"card bg-2 my-2"}>
            <div className={"card-body"}>
                <h5 className={"card-title"}>
                    It does <span className={"text-danger"}>not</span> have
                </h5>
                <div className={"d-flex flex-wrap"}>
                    {columnNo.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                    {columnNo.map(c => {
                        return <DataItem data={item.data[c._id]} column={c} key={c._id}/>
                    })}
                </div>
            </div>
        </div>
        <div className={"card bg-2 my-2"}>
            <div className={"card-body"}>
                <h5 className={"card-title"}>
                    Other features are
                </h5>
                <div className={"d-flex flex-wrap"}>
                    {columnArray.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                    {columnArray.map(c => {
                        return <DataItem data={item.data[c._id]} column={c} key={c._id}/>
                    })}
                </div>
            </div>
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const items = await getItems()
    const paths = items.map(i => {
        return {
            params: {
                id: i._id
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
    const tablesContainingItem = await find("tables", {items: [params.id]})
    const columns = await getColumns()
    const item = await getItem(params.id)
    console.log("Found Item:", item)

    return {
        props: {
            tabs,
            tablesContainingItem,
            columns,
            item
        },
        revalidate: 10
    }
}
