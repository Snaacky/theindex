import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {getTables, updateTable} from "./tables"

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

export async function updateItem(_id, {name, urls, nsfw, description, blacklist, sponsor, data}) {
    if (!_id) {
        throw "Updating item and no _id specified"
    }

    let _data = {}
    if (name) {
        _data.name = name
    }
    if (urls) {
        _data.name = urls
    }
    if (nsfw) {
        _data.nsfw = nsfw
    }
    if (description) {
        _data.description = description
    }
    if (blacklist) {
        _data.blacklist = blacklist
    }
    if (sponsor) {
        _data.sponsor = sponsor
    }
    if (data) {
        _data.data = data
    }

    return await updateOne("items", {_id}, _data)
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
                        return await updateTable(table._id, {
                            items: table.items.filter(c => c !== _id)
                        })
                    }
                } else if (iTables.includes(table._id)) {
                    return await updateTable(table._id, {
                        items: table.items.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteItem(_id) {
    return await deleteOne("items", {_id})
}
