import {findOne, getAll, insert, updateOne} from "./db";

export async function getTabs() {
    return await getAll("tabs")
}

export async function addTab(url_id, title, nsfw, description, tables) {
    return await insert("tabs", {
        url_id,
        title,
        nsfw,
        description,
        tables: tables || []
    })
}

export async function updateTab(_id, url_id, title, nsfw, description, tables) {
    return await updateOne("tabs", {_id}, {
        url_id,
        title,
        nsfw,
        description,
        tables: tables || []
    })
}

export async function getTabsWithTables() {
    const tabs = await getTabs()
    return await Promise.all(tabs.map(async (t) => {
        t.tables = await Promise.all(t.tables.map(
            async (table) => await findOne("tables", {_id: table._id})
        ))
        return t
    }))
}
