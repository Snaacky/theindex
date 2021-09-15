import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import IconLibrary from "../components/icons/IconLibrary"
import React from "react"
import LibraryBoard from "../components/boards/LibraryBoard"
import useSWR from "swr"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getLibraries} from "../lib/db/libraries"

export default function Libraries({libraries: staticLibraries}) {
    const [session] = useSession()
    let {data: libraries} = useSWR("/api/libraries")
    libraries = libraries || staticLibraries

    const description = "Libraries are over-categories of a bunch of collections that fit into it's category"
    return <>
        <Head>
            <title>
                {"All libraries | " + siteName}
            </title>
            <meta name="description" content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Libraries on The Anime Index"}/>
            <meta name="twitter:description" content={"View all collection of collections"}/>
        </Head>

        <h2>
            <IconLibrary/> All libraries
        </h2>
        <p>
            {description}
        </p>

        <LibraryBoard libraries={libraries} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticProps() {
    const libraries = await getLibraries()
    return {
        props: {
            libraries
        },
        revalidate: 30
    }
}
