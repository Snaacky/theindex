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

    const description = "Collections are like a curated table listing various items. Every entry is done by hand from the editor-team"
    return <>
        <Head>
            <title>
                {"All collections | " + siteName}
            </title>
            <meta name={"description"} content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Collections on The Anime Index"}/>
            <meta name="twitter:description" content={"View all curated collections of sites"}/>
        </Head>

        <h2>
            <IconCollection/> All collections
        </h2>
        <p>
            {description}
        </p>

        <CollectionBoard collections={collections} updateURL={""} deleteURL={"/api/delete/collection"}
                         canEdit={isEditor(session)}/>
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
