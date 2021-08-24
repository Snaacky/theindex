import {deleteOne, getAll, insert, updateOne} from "./db"

export async function getColumns() {
    return await getAll("columns")
}

export async function addColumn(urlId, title, nsfw, description, type, values) {
    if (!urlId || !title || !type) {
        throw "Adding column and no urlId, type or title specified"
    }

    return await insert("columns", {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function updateColumn(_id, urlId, title, nsfw, description, type, values) {
    if (!_id || !urlId || !title || !type) {
        throw "Updating column and no _id, urlId, type or title specified"
    }

    return await updateOne("columns", {_id}, {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function deleteColumn(_id) {
    return await deleteOne("columns", {_id})
}
