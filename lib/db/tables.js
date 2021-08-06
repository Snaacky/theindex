import {deleteOne, findOne, getAll, insert, updateOne} from "./db"

export async function getTables() {
    return await getAll("tables")
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

export async function updateTable(_id, urlId, title, nsfw, description, columns, items) {
    if (!_id || !urlId || !title) {
        throw "Updating table and no _id, urlId or title specified"
    }

    if (typeof items === "undefined") {
        return await updateOne("tables", {_id}, {
            urlId,
            title,
            nsfw: nsfw || false,
            description: description || "",
            columns: columns || []
        })
    }

    return await updateOne("tables", {_id}, {
        urlId,
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

export async function deleteTable(_id) {
    return await deleteOne("tables", {_id})
}

