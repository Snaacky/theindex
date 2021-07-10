import {findOne, getAll, insert, updateOne} from "./db";

export async function getTables() {
    return await getAll("tables")
}

export async function addTable(url_id, title, nsfw, description, columns, items) {
    if (!url_id || !title) {
        throw "Adding table and no url_id or title specified"
    }

    return await insert("tables", {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateTable(_id, url_id, title, nsfw, description, columns, items) {
    if (!_id || !url_id || !title) {
        throw "Updating table and no _id, url_id or title specified"
    }

    return await updateOne("tabs", {_id}, {
        url_id,
        title,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function getTableWithColumnsAndItems(table) {
    table.columns = await Promise.all((table.columns || []).map(
        async (t) => {
            t.data = await findOne("columns", {_id: t._id})
            return t
        }
    ))
    table.items = await Promise.all((table.items || []).map(
        async (t) => {
            t.data = await findOne("items", {_id: t._id})
            return t
        }
    )) || []
    return table
}
