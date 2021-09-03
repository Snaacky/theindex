import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"
import {getLibraries, updateLibrary} from "./libraries"

export async function getTables() {
    const tables = await getAll("tables")
    tables.forEach(t => t.img = randIcon())
    return tables
}

export async function getTable(_id) {
    return await findOne("tables", {_id})
}

export async function addTable(urlId, name, nsfw, description, columns, items) {
    if (!urlId || !name) {
        throw "Adding table and no urlId or name specified"
    }

    return await insert("tables", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateTable(_id, {urlId, name, nsfw, description, columns, items}) {
    if (!_id) {
        throw "Updating table and no _id specified"
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
    return await updateOne("tables", {_id}, data)

}

export async function updateTableLibraries(_id, tLibraries) {
    if (!_id) {
        throw "Updating table libraries and no _id specified"
    }

    const allLibraries = await getLibraries()
    return await Promise.all(
        allLibraries.map(
            async library => {
                if (library.tables.includes(_id)) {
                    if (!tLibraries.includes(library._id)) {
                        return await updateLibrary(library._id, {
                            tables: library.tables.filter(c => c !== _id)
                        })
                    }
                } else if (tLibraries.includes(library._id)) {
                    return await updateLibrary(library._id, {
                        tables: library.tables.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteTable(_id) {
    return await deleteOne("tables", {_id})
}
