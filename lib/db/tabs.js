import {count, deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"

export async function getTabs() {
    return (await getAll("tabs")).sort((a, b) => a.order > b.order ? 1 : -1)
}

export async function getTab(_id) {
    return await findOne("tabs", {_id})
}

export async function countTabs() {
    return await count("tabs")
}

export async function addTab(urlId, name, nsfw, description, tables) {
    if (!urlId || !name) {
        throw "Adding tab and no urlId or name specified"
    }

    return await insert("tabs", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || [],
        order: await countTabs()
    })
}

export async function updateTab(_id, {urlId, name, nsfw, description, tables, order}) {
    if (!_id) {
        throw "Updating tab and no _id specified"
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
    return await updateOne("tabs", {_id}, data)
}

export async function getTabsWithTables() {
    const tabs = await getTabs()
    return await Promise.all(tabs.map(async (t) => {
        t.tables = await Promise.all(t.tables.map(
            async (table) => await findOne("tables", {_id: table})
        ))
        t.tables.forEach(t => t.img = randIcon())
        return t
    }))
}

export async function deleteTab(_id) {
    return await deleteOne("tabs", {_id})
}
