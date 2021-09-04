import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getLibrariesWithCollections} from "../../../lib/db/libraries"
import {getCollection, getCollections} from "../../../lib/db/collections"
import Link from "next/link"
import {getColumns} from "../../../lib/db/columns"
import EditCollection from "../../../components/edit/EditCollection"
import ColumnBoard from "../../../components/boards/ColumnBoard"
import LibraryBoard from "../../../components/boards/LibraryBoard"
import ViewAll from "../../../components/buttons/ViewAll"

export default function EditorCollection({_id, libraries, collections, columns, collection}) {
    let librariesWithCollection = []
    if (_id !== "_new") {
        collection.columns = collection.columns.map(c => columns.find(t => t._id === c))
        librariesWithCollection = libraries.filter(t => t.collections.some(c => c._id === collection._id))
    }

    return <>
        <Head>
            <title>
                {(_id === "_new" ? "Create collection" : "Edit collection " + collection.name) + " | " + siteName}
            </title>
        </Head>

        <h2>
            {_id === "_new" ? "Create a new collection" : <>
                Edit collection <Link href={"/collection/" + collection.urlId}>{collection.name}</Link>
            </>}
            <span className={"float-end"}>
                <ViewAll type={"collections"}/>
            </span>
        </h2>
        {_id !== "_new" ?
            <small className={"text-muted"}>
                ID: <code>{collection._id}</code>
            </small> : <></>}

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                {_id === "_new" ? <EditCollection collections={collections}/> :
                    <EditCollection collections={collections} _id={collection._id} urlId={collection.urlId}
                                    name={collection.name} nsfw={collection.nsfw} description={collection.description}/>
                }
            </div>
        </div>

        <h4>
            Libraries with this collection
        </h4>
        {_id !== "_new" ?
            <LibraryBoard _id={collection._id} libraries={librariesWithCollection} allLibraries={libraries}
                          canMove={false} canEdit={true}
                          updateURL={"/api/edit/collection/libraries"} deleteURL={""} forceEditMode={true}/> :
            <div className={"text-muted"}>
                Libraryselection will be available once the collection has been created
            </div>
        }

        <h4>
            Columns used in this collection
        </h4>
        {_id !== "_new" ?
            <ColumnBoard _id={collection._id} columns={collection.columns} allColumns={columns} canMove={false}
                         canEdit={true}
                         forceEditMode={true}/> :
            <div className={"text-muted"}>
                Column selection will be available once the collection has been created
            </div>
        }
    </>
}

EditorCollection.auth = {
    requireEditor: true
}

export async function getServerSideProps({params}) {
    let collection = {}
    if (params.id !== "_new") {
        collection = await getCollection(params.id)
        if (!collection) {
            return {
                notFound: true
            }
        }
    }

    return {
        props: {
            _id: params.id,
            libraries: await getLibrariesWithCollections(),
            collections: await getCollections(),
            columns: await getColumns(),
            collection
        }
    }
}
