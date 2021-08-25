import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"

export async function getTables() {
    const tables = await getAll("tables")
    tables.forEach(t => t.img = randIcon())
    return tables
}

export async function addTable(urlId, title, nsfw, description, columns, items) {
    if (!urlId || !title) {
        throw "Adding table and no urlId or title specified"
    }

    return await insert("tables", {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateTable(_id, urlId, title, nsfw, description, items) {
    if (!_id || !urlId || !title) {
        throw "Updating table and no _id, urlId or title specified"
    }

    if (typeof items === "undefined") {
        return await updateOne("tables", {_id}, {
            urlId,
            title,
            nsfw: nsfw || false,
            description: description || ""
        })
    }

    return await updateOne("tables", {_id}, {
        urlId,
        title,
        nsfw: nsfw || false,
        description: description || "",
        items: items || []
    })
}

export async function updateTableItems(_id, items) {
    if (!_id) {
        throw "Updating table items and no _id specified"
    }

    return await updateOne("tables", {_id}, {
        items: items || []
    })
}

export async function updateTableColumns(_id, columns) {
    if (!_id) {
        throw "Updating table columns and no _id specified"
    }

    return await updateOne("tables", {_id}, {
        columns: columns || []
    })
}

export async function getTableWithColumnsAndItems(table) {
    table.columns = await Promise.all((table.columns || []).map(
        async (t) => await findOne("columns", {_id: t})
    ))
    table.items = (await Promise.all((table.items || []).map(
        async (t) => await findOne("items", {_id: t})
    )) || []).sort((a, b) => a.title < b.title ? 1 : -1)
    return table
}

export async function deleteTable(_id) {
    return await deleteOne("tables", {_id})
}
