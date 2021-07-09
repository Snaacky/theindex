import {insert, find, getAll, findOne} from "./db";
import {getTabs} from "./tabs";

export async function getTables() {
    return await getAll("tables")
}


export function addTable(url_id, title, nsfw, description, tabs) {
    return insert("tables", {
        url_id,
        title,
        nsfw,
        description,
        tabs
    })
}

export async function getTableById(_id) {
    return await find("tables", {_id})
}


export async function getTableWithColumnsAndItems() {
    const tables = await getTables()
    return await Promise.all(tables.map(async (t) => {
        t.tables = await Promise.all(t.tables.map(
            async (table) => await findOne("tables", {_id: table._id})
        ))
        return t
    }))
}
