import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {getCollections, updateCollection} from "./collections"
import {getLists, updateList} from "./lists";

export async function getColumns() {
    return await getAll("columns")
}

export async function getColumn(_id) {
    return await findOne("columns", {_id})
}

export async function addColumn(urlId, name, nsfw, description, type, values) {
    if (!urlId || !name || !type) {
        throw "Adding column and no urlId, type or name specified"
    }

    return await insert("columns", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function updateColumn(_id, {urlId, name, nsfw, description, type, values}) {
    if (!_id) {
        throw "Updating column and no _id specified"
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
    if (type) {
        data.type = type
    }
    if (values) {
        data.values = values
    }

    return await updateOne("columns", {_id}, data)
}

export async function updateColumnCollections(_id, cCollections) {
    if (!_id) {
        throw "Updating column collections and no _id specified"
    }

    const allCollections = await getCollections()
    return await Promise.all(
        allCollections.map(
            async collection => {
                if (collection.columns.includes(_id)) {
                    if (!cCollections.includes(collection._id)) {
                        return await updateCollection(collection._id, {
                            columns: collection.columns.filter(c => c !== _id)
                        })
                    }
                } else if (cCollections.includes(collection._id)) {
                    return await updateCollection(collection._id, {
                        columns: collection.columns.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteColumn(_id) {
    // remove column from all user lists
    const allLists = await getLists()
    await Promise.all(
        allLists.map(
            async list => {
                if (list.columns.includes(_id)) {
                    return await updateList(list._id, {
                        columns: list.columns.filter(c => c !== _id)
                    })
                }
            }
        )
    )

    // remove column from all collections
    const allCollections = await getCollections()
    await Promise.all(
        allCollections.map(
            async collection => {
                if (collection.columns.includes(_id)) {
                    return await updateCollection(collection._id, {
                        columns: collection.columns.filter(c => c !== _id)
                    })
                }
            }
        )
    )
    return await deleteOne("columns", {_id})
}
