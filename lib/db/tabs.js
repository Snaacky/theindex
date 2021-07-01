import {addEntry, find, getAll, updateOne} from "./db";

export async function getTabs() {
    return await getAll("tabs")
}

export function addTab(url_id, title, nsfw, description) {
    addEntry("tabs", {
        url_id,
        title,
        nsfw,
        description
    })
}

export function updateTab(_id, url_id, title, nsfw, description) {
    updateOne("tabs", {_id}, {
        url_id,
        title,
        nsfw,
        description
    })
}

export async function getTablesOfTab(_id) {
    return await find("tables", {tabs: _id})
}

export async function getTabsWithTables() {
    const tabs = await getTabs()
    return JSON.parse(JSON.stringify(
        await Promise.all(tabs.map(async (t) => {
            t.tables = await getTablesOfTab(t._id)
            return t
        }))
    ))
}
