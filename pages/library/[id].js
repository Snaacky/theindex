import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import {getLibraries} from "../../lib/db/libraries"
import {useSession} from "next-auth/client"
import {canEdit, isEditor} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import CollectionBoard from "../../components/boards/CollectionBoard"
import useSWR from "swr"
import {getByUrlId} from "../../lib/db/db"
import IconLibrary from "../../components/icons/IconLibrary"
import ViewAllButton from "../../components/buttons/ViewAllButton"
import IconNSFW from "../../components/icons/IconNSFW"

export default function Library({_id, library: staticLibrary}) {
    const [session] = useSession()
    let {data: library} = useSWR("/api/library/" + _id)
    library = library || staticLibrary

    const title = "Library " + library.name + " on " + process.env.NEXT_PUBLIC_SITE_NAME
    return <>
        <Head>
            <title>
                {library.name + " | " + process.env.NEXT_PUBLIC_SITE_NAME}
            </title>

            <meta property="og:title" content={title}/>
            <meta name="twitter:title" content={title}/>

            <meta name="description" content={library.description}/>
            <meta property="og:description" content={library.description}/>
            <meta name="twitter:description" content={library.description}/>

            <meta name="twitter:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
            <meta property="og:image" content={process.env.NEXT_PUBLIC_DOMAIN + "/icons/logo.png"}/>
        </Head>

        <div className={"row"} style={{marginTop: "4rem"}}>
            <div className={"col-auto"}>
                <div className={"d-absolute mb-2"} style={{marginTop: "-3.2rem"}}>
                    <Image src={"/img/" + library.img} alt={"Image of collection"} width={"148px"} height={"148px"}
                           className={"rounded-circle bg-6"}/>
                </div>
            </div>
            <div className={"col"}>
                <div className={"row"}>
                    <div className={"col"}>
                        <h2>
                            <IconLibrary/> {library.name}
                            {canEdit(session) ? <Link href={"/edit/library/" + library._id}>
                                <a title={"Edit tab"} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link> : <></>}
                        </h2>
                    </div>
                    <div className={"col-12 col-md-auto mb-2"}>
                        {library.nsfw ? <IconNSFW/> : <></>}
                        <span className={"ms-2"}>
                            <ViewAllButton type={"libraries"}/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <p style={{
            whiteSpace: "pre-line"
        }}>
            {library.description}
        </p>

        <CollectionBoard _id={library._id} collections={library.collections} key={library._id}
                         canEdit={isEditor(session)}/>
    </>
}

export async function getStaticPaths() {
    const libraries = await getLibraries()
    const paths = libraries.map(library => {
        return {
            params: {
                id: library.urlId
            }
        }
    })

    return {
        paths,
        fallback: "blocking",
    }
}

export async function getStaticProps({params}) {
    const library = await getByUrlId("libraries", params.id)
    if (!library) {
        return {
            notFound: true,
            revalidate: 30
        }
    }

    return {
        props: {
            _id: library._id,
            library
        },
        revalidate: 30
    }
}
