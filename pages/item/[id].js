import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import {getItem, getItems} from "../../lib/db/items"
import DataItem from "../../components/data/DataItem"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import {splitColumnsIntoTypes} from "../../lib/item"
import useSWR from "swr"
import Error from "../_error"
import IconStar from "../../components/icons/IconStar"
import IconBookmark from "../../components/icons/IconBookmark"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import IconNewTabLink from "../../components/icons/IconNewTabLink"
import {getColumns} from "../../lib/db/columns"
import {getCollections} from "../../lib/db/collections"
import IconItem from "../../components/icons/IconItem"
import OnlineStatus from "../../components/data/OnlineStatus"
import IconNSFW from "../../components/icons/IconNSFW"
import IconSponsor from "../../components/icons/IconSponsor"

export default function Item({_id, item: staticItem, columns: staticColumns, collections: staticCollections}) {
    const [session] = useSession()
    let {data: item, errorItem} = useSWR("/api/item/" + _id)
    let {data: columns, errorColumns} = useSWR("/api/columns")
    let {data: collections, errorCollections} = useSWR("/api/collections")

    if (errorItem) {
        return <Error error={errorItem} statusCode={errorItem.status}/>
    } else if (errorColumns) {
        return <Error error={errorColumns} statusCode={errorColumns.status}/>
    } else if (errorCollections) {
        return <Error error={errorCollections} statusCode={errorCollections.status}/>
    }
    item = item || staticItem
    columns = columns || staticColumns
    collections = collections || staticCollections

    const collectionsContainingItem = collections.filter(t => t.items.includes(_id))
    const column = splitColumnsIntoTypes(Object.keys(item.data).map(k => columns.find(c => c._id === k)), item)

    return <>
        <Head>
            <title>
                {item.name + " | " + siteName}
            </title>
            {item.blacklist ?
                <meta name="robots" content="noindex, archive, follow"/> :
                <>
                    <meta name="description" content={item.description}/>
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:title" content={"Item " + item.name + " on The Anime Index"}/>
                    <meta name="twitter:description" content={item.description}/>
                </>
            }
        </Head>

        <h2>
            <IconItem/> {item.blacklist ? <span className={"text-danger"}>
                            Blacklisted: <del>{item.name}</del>
                        </span> : item.name}
            <IconNewTabLink url={item.urls[0]}/>
            {canEdit(session) ? <Link href={"/edit/item/" + item._id}>
                <a title={"Edit item"} className={"ms-2"}>
                    <IconEdit/>
                </a>
            </Link> : <></>}
            <span style={{fontSize: "1.2rem"}}>
                {collectionsContainingItem.map(t => {
                    return <Link href={"/collection/" + t.urlId} key={t._id}>
                        <a className={"ms-2"} title={"View collection " + t.name}>
                            <DataBadge name={t.name} style={"primary"}/>
                        </a>
                    </Link>
                })}
                <div className={"float-end"}>
                    {item.sponsor ? <IconSponsor/> : <></>}
                    {item.nsfw ?
                        <span className={"ms-2"}>
                            <IconNSFW/>
                        </span> : <></>
                    }
                    <span className={"ms-2"}>
                        <IconStar item={item}/>
                    </span>
                    <span className={"ms-2"}>
                        <IconBookmark item={item}/>
                    </span>
                </div>
            </span>
        </h2>
        <div className={"d-flex flex-wrap mb-2"}>
            {item.urls.map(url => <a href={url} target={"_blank"} rel={"noreferrer"} key={url}
                                     className={"me-2"}>
                <DataBadge name={url} style={"primary"}/>
            </a>)}
        </div>
        <span>
            <span>
                Status <OnlineStatus url={item.urls[0]}/>
            </span>
            <small className={"text-warning me-2"} title={item.stars + " users have starred this item"}>
                {item.stars}
                <FontAwesomeIcon icon={["fas", "star"]} className={"ms-1"}/>
            </small>
        </span>
        <p style={{
            whiteSpace: "pre-line"
        }}>
            {item.description}
        </p>

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
                        {column.yes.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                        {column.yes.map(c => {
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
                        {column.no.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                        {column.no.map(c => {
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
                        {column.array.length === 0 ? <span className={"text-muted"}>No data found</span> : <></>}
                        {column.array.map(c => {
                            return <div key={c._id}>
                                <Link href={"/column/" + c.urlId}>
                                    <a className={"me-2"} title={"View column " + c.name}>
                                        {c.name}:
                                    </a>
                                </Link>
                                <DataItem data={item.data[c._id]} column={c}/>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            {column.text.length > 0 ? column.text.map(c =>
                <div className={"card bg-2 my-2"} key={c._id}>
                    <div className={"card-body"}>
                        <h5 className={"card-title"}>
                            {c.name}
                        </h5>
                        <p className={"card-text"}>
                            {item.data[c._id]}
                        </p>
                    </div>
                </div>) : <></>}
        </> : <></>}
    </>
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
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const item = await getItem(params.id)
    if (!item) {
        return {
            notFound: true,
            revalidate: 30
        }
    }

    const columns = await getColumns()
    const collections = await getCollections()

    return {
        props: {
            _id: params.id,
            item,
            columns,
            collections
        },
        revalidate: 30
    }
}
