import {deleteOne, getAll, insert, updateOne} from "./db"

export async function getColumns() {
    return await getAll("columns")
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

export async function updateColumn(_id, urlId, name, nsfw, description, type, values) {
    if (!_id || !urlId || !name || !type) {
        throw "Updating column and no _id, urlId, type or name specified"
    }

    return await updateOne("columns", {_id}, {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function deleteColumn(_id) {
    return await deleteOne("columns", {_id})
}
