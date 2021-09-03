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

export async function addLibrary(urlId, name, nsfw, description, tables) {
    if (!urlId || !name) {
        throw "Adding library and no urlId or name specified"
    }

    return await insert("libraries", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || [],
        order: await countLibraries()
    })
}

export async function updateLibrary(_id, {urlId, name, nsfw, description, tables, order}) {
    if (!_id) {
        throw "Updating library and no _id specified"
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
    if (tables) {
        data.tables = tables
    }
    if (order) {
        data.order = order
    }
    return await updateOne("libraries", {_id}, data)
}

export async function getLibrariesWithTables() {
    const libraries = await getLibraries()
    return await Promise.all(libraries.map(async (t) => {
        t.tables = await Promise.all(t.tables.map(
            async (table) => await findOne("tables", {_id: table})
        ))
        t.tables.forEach(t => t.img = randIcon())
        return t
    }))
}

export async function deleteLibrary(_id) {
    return await deleteOne("libraries", {_id})
}
