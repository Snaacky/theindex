import {getAll, insert, updateOne} from "./db";

export async function getColumns() {
    return await getAll("columns")
}

export async function addColumn(url_id, title, nsfw, description, type, values) {
    if (!url_id || !title || !type) {
        throw "Adding column and no url_id, type or title specified"
    }

    return await insert("columns", {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function updateColumn(_id, url_id, title, nsfw, description, type, values) {
    if (!_id || !url_id || !title || !type) {
        throw "Updating column and no _id, url_id, type or title specified"
    }

    return await updateOne("tabs", {_id}, {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}
