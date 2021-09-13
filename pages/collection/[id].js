import {siteName} from "../../components/layout/Layout"
import {getCollections} from "../../lib/db/collections"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import ItemBoard from "../../components/boards/ItemBoard"
import useSWR from "swr"
import Error from "../_error"
import {getByUrlId} from "../../lib/db/db"
import {getLibraries} from "../../lib/db/libraries"
import ViewAllButton from "../../components/buttons/ViewAllButton"
import IconCollection from "../../components/icons/IconCollection"
import IconNSFW from "../../components/icons/IconNSFW"

export default function Collection({_id, collection: staticCollection, libraries: staticLibraries}) {
    const [session] = useSession()
    let {data: collection, errorCollection} = useSWR("/api/collection/" + _id)
    let {data: libraries, errorLibraries} = useSWR("/api/libraries")

    if (errorCollection) {
        return <Error error={errorCollection} statusCode={errorCollection.status}/>
    } else if (errorLibraries) {
        return <Error error={errorLibraries} statusCode={errorLibraries.status}/>
    }

    collection = collection || staticCollection
    libraries = libraries || staticLibraries

    const librariesContainingCollection = libraries.filter(library => library.collections.some(t => t._id === collection._id))

    return <>
        <Head>
            <title>
                {collection.name + " | " + siteName}
            </title>
            <meta name="description" content={collection.description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Collection " + collection.name + " on The Anime Index"}/>
            <meta name="twitter:description" content={collection.description}/>
            <meta name="twitter:image" content={collection.img}/>
        </Head>

        <div className={"row"}>
            <div className={"col-auto"}>
                <div className={"mb-2"}>
                    <Image src={"/img/" + collection.img} alt={"Image of collection"} width={"148px"} height={"148px"}
                           className={"rounded-circle bg-6"}/>
                </div>
            </div>
            <div className={"col"}>
                <div className={"row"}>
                    <div className={"col"}>
                        <h2>
                            <IconCollection/> {collection.name}
                            {canEdit(session) ? <Link href={"/edit/collection/" + collection._id}>
                                <a title={"Edit collection"} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link> : <></>}
                            <span style={{fontSize: "1.2rem"}}>
                                {librariesContainingCollection.map(t => {
                                    return <Link href={"/library/" + t.urlId} key={t._id}>
                                        <a title={"View library" + t.name}>
                                            <div className={"badge rounded-pill bg-primary ms-2"}>
                                                {t.name}
                                            </div>
                                        </a>
                                    </Link>
                                })}
                            </span>
                        </h2>
                    </div>
                    <div className={"col-auto"}>
                        {collection.nsfw ? <IconNSFW/> : <></>}
                        <span className={"ms-2"}>
                            <ViewAllButton type={"collections"}/>
                        </span>
                    </div>
                </div>
                <p style={{
                    whiteSpace: "pre-line"
                }}>
                    {collection.description}
                </p>
            </div>
        </div>

        <ItemBoard _id={collection._id} items={collection.items} columns={collection.columns} key={collection._id}
                   canEdit={canEdit(session)}/>
    </>
}

export async function getStaticPaths() {
    const collections = await getCollections()
    const paths = collections.map(collection => {
        return {
            params: {
                id: collection.urlId
            }
        }
    })

    return {
        paths,
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const collection = await getByUrlId("collections", params.id)
    if (!collection) {
        return {
            notFound: true,
            revalidate: 30
        }
    }

    return {
        props: {
            _id: collection._id,
            collection,
            libraries: await getLibraries()
        },
        revalidate: 30
    }
}
