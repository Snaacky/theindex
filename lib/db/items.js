import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {getTables, updateTableItems} from "./tables"

export async function getItems() {
    return await getAll("items")
}

export async function getItem(_id) {
    return await findOne("items", {_id: _id})
}

export async function addItem(name, urls, nsfw, description, blacklist, sponsor, data) {
    if (!name) {
        throw "Adding item and no name specified"
    }

    return await insert("items", {
        name,
        urls: urls || [],
        nsfw: nsfw || false,
        description: description || "",
        blacklist: blacklist || false,
        sponsor: sponsor || false,
        data: data || {}
    })
}

export async function updateItem(_id, name, urls, nsfw, description, blacklist, sponsor, data) {
    if (!_id || !name) {
        throw "Updating item and no _id or name specified"
    }

    return await updateOne("items", {_id}, {
        name,
        urls: urls || [],
        nsfw: nsfw || false,
        description: description || "",
        blacklist: blacklist || false,
        sponsor: sponsor || false,
        data: data || {}
    })
}

export async function updateItemTables(_id, iTables) {
    if (!_id) {
        throw "Updating item tables and no _id specified"
    }

    const allTables = await getTables()
    return await Promise.all(
        allTables.map(
            async table => {
                if (table.items.includes(_id)) {
                    if (!iTables.includes(table._id)) {
                        return await updateTableItems(table._id, table.items.filter(c => c !== _id))
                    }
                } else if (iTables.includes(table._id)) {
                    return await updateTableItems(table._id, table.items.concat([_id]))
                }
            }
        )
    )
}

export async function deleteItem(_id) {
    return await deleteOne("items", {_id})
}
