import Layout, {siteTitle} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {canEdit} from "../../lib/session"
import {getItem, getItems} from "../../lib/db/items"
import {find} from "../../lib/db/db"
import {getColumns} from "../../lib/db/columns"
import DataItem from "../../components/data/DataItem"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge";

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
            {item.blacklist ?
                <meta name="robots" content="noindex, archive, follow"/> :
                <meta name="description" content={item.description}/>
            }
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h3>
                        {item.blacklist ? <span className={"text-danger"}>
                            Blacklisted: <del>{item.title}</del>
                        </span> : item.title}
                        <span style={{fontSize: "1.2rem"}}>
                            {tablesContainingItem.map(t => {
                                return <Link href={"/table/" + t.urlId} key={t._id}>
                                    <a title={"View table " + t.title}>
                                        <div className={"badge rounded-pill bg-primary mx-2"}>
                                            {t.title}
                                        </div>
                                    </a>
                                </Link>
                            })}
                            <div className={"float-end"}>
                                {item.sponsor ? <DataBadge title={"Sponsor"} style={"warning text-dark"}/> : <></>}
                                {item.nsfw ? <span className={"ms-2"}>
                                    <DataBadge data={false} title={"NSFW"}/>
                                </span> : <></>}
                                {canEdit(session) ? <Link href={"/edit/item/" + item._id}>
                                    <a title={"Edit table"} className={"ms-2"}>
                                        <IconEdit/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                    </h3>
                </div>
                <div className={"d-flex flex-wrap"}>
                    {item.urls.map(url => <a href={url} target={"_blank"} rel={"noreferrer"} key={url}
                                             className={"me-2"}>
                        <DataBadge title={url} style={"primary"}/>
                    </a>)}
                </div>
                <p className={"card-text"}>
                    {item.description}
                </p>
            </div>
        </div>

        {item.blacklist ? <div className={"card bg-2 my-2"}>
            <div className={"card-body"}>
                <p className={"card-text"}>
                    This item has been <span className={"text-danger"}>blacklisted</span> due to misconduct of their
                    stuff or breaking our rules.
                    <br/>
                    You can apply to be un-<span className={"text-danger"}>blacklisted</span> by contacting our team on
                    discord.
                </p>
            </div>
        </div> : <></>}
        {!item.blacklist || canEdit(session) ? <>
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
                            return <div key={c._id}>
                                <Link href={"/column/" + c.urlId}>
                                    <a className={"me-2"} title={"View column " + c.title}>
                                        {c.title}:
                                    </a>
                                </Link>
                                <DataItem data={item.data[c._id]} column={c}/>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </> : <></>}
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
