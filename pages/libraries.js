import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import IconTab from "../components/icons/IconLibrary"
import React from "react"
import LibraryBoard from "../components/boards/LibraryBoard"
import useSWR from "swr"
import Error from "./_error"
import {useSession} from "next-auth/client"
import {isEditor} from "../lib/session"
import {getLibraries} from "../lib/db/libraries"

export default function Libraries({libraries: staticLibraries}) {
    const [session] = useSession()
    let {data: libraries, error} = useSWR("/api/libraries")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    libraries = libraries || staticLibraries

    return <>
        <Head>
            <title>
                {"All libraries | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Libraries on The Anime Index"}/>
            <meta name="twitter:description" content={"View all collection of tables"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconTab/> All libraries
                </h2>
            </div>
        </div>

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
