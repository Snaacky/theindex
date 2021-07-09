import {insert, find, getAll} from "./db";

export async function getTables() {
    return await getAll("tables")
}


export function addTable(url_id, title, nsfw, description, tabs) {
    insert("tables", {
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
