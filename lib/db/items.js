import {count, deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {getCollections, updateCollection} from "./collections"

export async function getItems() {
    return await Promise.all(
        (await getAll("items")).map(async i => {
            i.stars = await count("users", {favs: i._id})
            return i
        })
    )
}

export async function getItem(_id) {
    const item = await findOne("items", {_id: _id})
    item.stars = await count("users", {favs: _id})
    return item
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
        _data.urls = urls
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

export async function updateItemCollections(_id, iCollections) {
    if (!_id) {
        throw "Updating item collections and no _id specified"
    }

    const allCollections = await getCollections()
    return await Promise.all(
        allCollections.map(
            async collection => {
                if (collection.items.includes(_id)) {
                    if (!iCollections.includes(collection._id)) {
                        return await updateCollection(collection._id, {
                            items: collection.items.filter(c => c !== _id)
                        })
                    }
                } else if (iCollections.includes(collection._id)) {
                    return await updateCollection(collection._id, {
                        items: collection.items.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteItem(_id) {
    return await deleteOne("items", {_id})
}
