import {count, deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"

export async function getLibraries() {
    return (await getAll("libraries")).sort((a, b) => a.order > b.order ? 1 : -1)
}

export async function getLibrary(_id) {
    return await findOne("libraries", {_id})
}

export async function countLibraries() {
    return await count("libraries")
}

export async function addLibrary(urlId, img, name, nsfw, description, collections) {
    if (!urlId || !name) {
        throw "Adding library and no urlId or name specified"
    }

    return await insert("libraries", {
        urlId,
        name,
        img: img || "puzzled.png",
        nsfw: nsfw || false,
        description: description || "",
        collections: collections || [],
        order: await countLibraries()
    })
}

export async function updateLibrary(_id, {urlId, img, name, nsfw, description, collections, order}) {
    if (!_id) {
        throw "Updating library and no _id specified"
    }

    let data = {}
    if (urlId) {
        data.urlId = urlId
    }
    if (img) {
        data.img = img
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
    if (collections) {
        data.collections = collections
    }
    if (order) {
        data.order = order
    }
    return await updateOne("libraries", {_id}, data)
}

export async function getLibrariesWithCollections() {
    const libraries = await getLibraries()
    return await Promise.all(libraries.map(async (t) => {
        t.collections = await Promise.all(t.collections.map(
            async (collection) => await findOne("collections", {_id: collection})
        ))
        t.collections.forEach(t => t.img = randIcon())
        return t
    }))
}

export async function deleteLibrary(_id) {
    return await deleteOne("libraries", {_id})
}
