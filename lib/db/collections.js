import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"
import {getLibraries, updateLibrary} from "./libraries"

export async function getCollections() {
    const collections = await getAll("collections")
    collections.forEach(t => t.img = randIcon())
    return collections
}

export async function getCollection(_id) {
    const collection = await findOne("collections", {_id})
    collection.img = randIcon()
    return collection
}

export async function addCollection(urlId, name, nsfw, description, columns, items) {
    if (!urlId || !name) {
        throw "Adding collection and no urlId or name specified"
    }

    return await insert("collections", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateCollection(_id, {urlId, name, nsfw, description, columns, items}) {
    if (!_id) {
        throw "Updating collection and no _id specified"
    }

    let data = {}
    if (urlId) {
        data.urlId = urlId
    }
    if (name) {
        data.name = name
    }
    if (nsfw) {
        data.nsfw = nsfw
    }
    if (description) {
        data.description = description
    }
    if (columns) {
        data.columns = columns
    }
    if (items) {
        data.items = items
    }
    return await updateOne("collections", {_id}, data)

}

export async function updateCollectionLibraries(_id, tLibraries) {
    if (!_id) {
        throw "Updating collection libraries and no _id specified"
    }

    const allLibraries = await getLibraries()
    return await Promise.all(
        allLibraries.map(
            async library => {
                if (library.collections.includes(_id)) {
                    if (!tLibraries.includes(library._id)) {
                        return await updateLibrary(library._id, {
                            collections: library.collections.filter(c => c !== _id)
                        })
                    }
                } else if (tLibraries.includes(library._id)) {
                    return await updateLibrary(library._id, {
                        collections: library.collections.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteCollection(_id) {
    return await deleteOne("collections", {_id})
}
