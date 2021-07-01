import {addEntry, find, getAll} from "./db";

export async function getTables() {
    return await getAll("tables")
}


export function addTable(url_id, title, nsfw, description, tabs) {
    addEntry("tables", {
        url_id,
        title,
        nsfw,
        description,
        tabs
    })
}

export async function getItemsOfTable(_id) {
    return await find("items", {tables: _id})
}
