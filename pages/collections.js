import Head from "next/head"
import React from "react"
import IconCollection from "../components/icons/IconCollection"
import CollectionBoard from "../components/boards/CollectionBoard"
import useSWR from "swr"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getCollections} from "../lib/db/collections"

const title = "Collections on The Anime Index"
const description = "Collections are like a curated table listing various items. Every entry is done by hand from the editor-team"

export default function Collections({collections: staticCollections}) {
    const [session] = useSession()
    let {data: collections} = useSWR("/api/collections")
    collections = collections || staticCollections

    return <>
        <Head>
            <title>
                {"All collections | " + process.env.NEXT_PUBLIC_SITE_NAME}
            </title>

            <meta property="og:title" content={title}/>
            <meta name="twitter:title" content={title}/>

            <meta name="description" content={description}/>
            <meta property="og:description" content={description}/>
            <meta name="twitter:description" content={description}/>

            <meta name="twitter:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
            <meta property="og:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
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
