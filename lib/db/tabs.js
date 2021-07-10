import {findOne, getAll, insert, updateOne} from "./db";
import randIcon from "../icon";

export async function getTabs() {
    return await getAll("tabs")
}

export async function addTab(url_id, title, nsfw, description, tables) {
    if (!url_id || !title) {
        throw "Adding tab and no url_id or title specified"
    }

    return await insert("tabs", {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || []
    })
}

export async function updateTab(_id, url_id, title, nsfw, description, tables) {
    if (!_id || !url_id || !title) {
        throw "Updating tab and no _id, url_id or title specified"
    }

    return await updateOne("tabs", {_id}, {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        tables: tables || []
    })
}

export async function getTabsWithTables() {
    const tabs = await getTabs()
    return await Promise.all(tabs.map(async (t) => {
        t.tables = await Promise.all(t.tables.map(
            async (table) => await findOne("tables", {_id: table._id})
        ))
        t.tables.forEach(t => t.img = randIcon())
        return t
    }))
}
