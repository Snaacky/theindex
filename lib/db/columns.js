import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {getTables, updateTable} from "./tables"

export async function getColumns() {
    return await getAll("columns")
}

export async function getColumn(_id) {
    return await findOne("columns", {_id})
}

export async function addColumn(urlId, name, nsfw, description, type, values) {
    if (!urlId || !name || !type) {
        throw "Adding column and no urlId, type or name specified"
    }

    return await insert("columns", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        type,
        values: values || []
    })
}

export async function updateColumn(_id, {urlId, name, nsfw, description, type, values}) {
    if (!_id) {
        throw "Updating column and no _id specified"
    }

    let data = {}
    if (urlId) {
        data.urlId = urlId
    }
    if (name) {
        data.name = name
    }
    if (nsfw) {
        data.nsfw = nsfw
    }
    if (description) {
        data.description = description
    }
    if (type) {
        data.type = type
    }
    if (values) {
        data.values = values
    }

    return await updateOne("columns", {_id}, data)
}

export async function updateColumnTables(_id, cTables) {
    if (!_id) {
        throw "Updating column tables and no _id specified"
    }

    const allTables = await getTables()
    return await Promise.all(
        allTables.map(
            async table => {
                if (table.columns.includes(_id)) {
                    if (!cTables.includes(table._id)) {
                        return await updateTable(table._id, {
                            columns: table.columns.filter(c => c !== _id)
                        })
                    }
                } else if (cTables.includes(table._id)) {
                    return await updateTable(table._id, {
                        columns: table.columns.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteColumn(_id) {
    return await deleteOne("columns", {_id})
}
