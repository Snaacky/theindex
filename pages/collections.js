import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconCollection from "../components/icons/IconCollection"
import CollectionBoard from "../components/boards/CollectionBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getCollections} from "../lib/db/collections"

export default function Collections({collections: staticCollections}) {
    const [session] = useSession()
    let {data: collections, error} = useSWR("/api/collections")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    collections = collections || staticCollections

    return <>
        <Head>
            <title>
                {"All collections | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Collections on The Anime Index"}/>
            <meta name="twitter:description" content={"View all curated collections of sites"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconCollection/> All collections
                </h2>
            </div>
        </div>

        <CollectionBoard collections={collections} updateURL={""} deleteURL={"/api/delete/collection"} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticProps() {
    const collections = await getCollections()
    return {
        props: {
            collections
        },
        revalidate: 30
    }
}
