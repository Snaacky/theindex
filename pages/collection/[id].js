import {siteName} from "../../components/layout/Layout"
import {getCollections} from "../../lib/db/collections"
import Head from "next/head"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import ItemBoard from "../../components/boards/ItemBoard"
import useSWR from "swr"
import Error from "../_error"
import {getByUrlId} from "../../lib/db/db"
import {getLibraries} from "../../lib/db/libraries"
import ViewAllButton from "../../components/buttons/ViewAllButton"
import IconCollection from "../../components/icons/IconCollection"

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
                <div className={"float-end"}>
                    {collection.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                    <span className={"ms-2"}>
                        <ViewAllButton type={"collections"}/>
                    </span>
                </div>
            </span>
        </h2>
        <p style={{
            whiteSpace: "pre-line"
        }}>
            {collection.description}
        </p>

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
