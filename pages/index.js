import Head from "next/head"
import Link from "next/link"
import {siteName} from "../components/layout/Layout"
import useSWR from "swr"
import Error from "./_error"
import {getLastViews} from "../lib/db/views"
import ItemCard from "../components/cards/ItemCard"
import CollectionCard from "../components/cards/CollectionCard"
import ListCard from "../components/cards/ListCard"

export default function Home(
    {
        trendingItem: staticTrendingItem,
        trendingCollection: staticTrendingCollection,
        trendingList: staticTrendingList
    }) {
    let {data: items, itemsError} = useSWR("/api/popular/items")
    let {data: collections, collectionsError} = useSWR("/api/popular/collections")
    let {data: lists, listsError} = useSWR("/api/popular/lists")

    if (itemsError) {
        return <Error error={itemsError} statusCode={itemsError.status}/>
    } else if (collectionsError) {
        return <Error error={collectionsError} statusCode={collectionsError.status}/>
    } else if (listsError) {
        return <Error error={listsError} statusCode={listsError.status}/>
    }

    items = (items || staticTrendingItem).slice(0, 10)
    collections = (collections || staticTrendingCollection).slice(0, 10)
    lists = (lists || staticTrendingList).slice(0, 10)

    return <>
        <Head>
            <title>{siteName}</title>
            <meta name="twitter:card" content="summary"/>
        </Head>

        <h2>
            Currently popular <Link href={"/items"}>items</Link>
        </h2>
        <div className={"d-flex flex-wrap"}>
            {items.map(item => {
                return <ItemCard item={item} key={item._id}/>
            })}
        </div>
        <div className={"mb-4"}>
            <span className={"text-muted"}>
                According to recent view counts
            </span>
            <span className={"float-end me-2"}>
                <Link href={"/items"}>
                    View all
                </Link>
            </span>
        </div>

        <h2>
            Currently popular <Link href={"/collections"}>collections</Link>
        </h2>
        <div className={"d-flex flex-wrap"}>
            {collections.map(collection => {
                return <CollectionCard collection={collection} key={collection._id}/>
            })}
        </div>
        <div className={"mb-4"}>
            <span className={"text-muted"}>
                According to recent view counts
            </span>
            <span className={"float-end me-2"}>
                <Link href={"/items"}>
                    View all
                </Link>
            </span>
        </div>

        <h2>
            Currently popular <Link href={"/lists"}>lists</Link>
        </h2>
        <div className={"d-flex flex-wrap"}>
            {lists.map(list => {
                return <ListCard list={list} key={list._id}/>
            })}
        </div>
        <div className={"mb-4"}>
            <span>
                <Link href={"/lists"}>
                    View all
                </Link>
            </span>
            <span className={"float-end me-2 text-muted"}>
                According to recent view counts
            </span>
        </div>

    </>
}

export async function getStaticProps() {
    const trendingItem = await getLastViews("item", 100)
    const trendingCollection = await getLastViews("collection", 100)
    const trendingList = await getLastViews("list", 100)
    return {
        props: {
            trendingItem,
            trendingCollection,
            trendingList
        },
        revalidate: 30
    }
}
