import {count, deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"

export async function getTabs() {
    return (await getAll("tabs")).sort((a, b) => a.order > b.order ? 1 : -1)
}

export async function countTabs() {
    return await count("tabs")
}

export async function addTab(urlId, title, nsfw, description, tables) {
    if (!urlId || !title) {
        throw "Adding tab and no urlId or title specified"
    }

    return await insert("tabs", {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || [],
        order: await countTabs()
    })
}

export async function updateTab(_id, urlId, title, nsfw, description, tables, order) {
    if (!_id || !urlId || !title) {
        throw "Updating tab and no _id, urlId or title specified"
    }

    return await updateOne("tabs", {_id}, {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || [],
        order
    })
}

export async function updateTabTables(_id, tables) {
    if (!_id) {
        throw "Updating tab tables and no _id specified"
    }

    return await updateOne("tabs", {_id}, {
        tables: tables || []
    })
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
