import Head from "next/head"
import IconLibrary from "../components/icons/IconLibrary"
import React from "react"
import LibraryBoard from "../components/boards/LibraryBoard"
import useSWR from "swr"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getLibraries} from "../lib/db/libraries"

const title = "Libraries on The Anime Index"
const description = "Libraries are over-categories of a bunch of collections that fit into it's category"

export default function Libraries({libraries: staticLibraries}) {
    const [session] = useSession()
    let {data: libraries} = useSWR("/api/libraries")
    libraries = libraries || staticLibraries

    return <>
        <Head>
            <title>
                {"All libraries | " + process.env.NEXT_PUBLIC_SITE_NAME}
            </title>

            <meta property="og:title" content={title}/>
            <meta name="twitter:title" content={title}/>

            <meta name="description" content={description}/>
            <meta property="og:description" content={description}/>
            <meta name="twitter:description" content={description}/>
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
