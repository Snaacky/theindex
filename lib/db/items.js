import {deleteOne, findOne, getAll, insert, updateOne} from "./db"

export async function getItems() {
    return await getAll("items")
}

export async function getItem(_id) {
    return await findOne("items", {_id: _id})
}

export async function addItem(title, urls, nsfw, description, blacklist, sponsor, data) {
    if (!title) {
        throw "Adding item and no title specified"
    }

    return await insert("items", {
        title,
        urls: urls || [],
        nsfw: nsfw || false,
        description: description || "",
        blacklist: blacklist || false,
        sponsor: sponsor || false,
        data: data || {}
    })
}

export async function updateItem(_id, title, urls, nsfw, description, blacklist, sponsor, data) {
    if (!_id || !title) {
        throw "Updating item and no _id or title specified"
    }

    return await updateOne("items", {_id}, {
        title,
        urls: urls || [],
        nsfw: nsfw || false,
        description: description || "",
        blacklist: blacklist || false,
        sponsor: sponsor || false,
        data: data || {}
    })
}

export async function deleteItem(_id) {
    return await deleteOne("items", {_id})
}
