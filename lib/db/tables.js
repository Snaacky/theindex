import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"
import {getTabs, updateTabTables} from "./tabs"

export async function getTables() {
    const tables = await getAll("tables")
    tables.forEach(t => t.img = randIcon())
    return tables
}

export async function getTable(_id) {
    return await findOne("tables", {_id})
}

export async function addTable(urlId, name, nsfw, description, columns, items) {
    if (!urlId || !name) {
        throw "Adding table and no urlId or name specified"
    }

    return await insert("tables", {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateTable(_id, urlId, name, nsfw, description, items) {
    if (!_id || !urlId || !name) {
        throw "Updating table and no _id, urlId or name specified"
    }

    if (typeof items === "undefined") {
        return await updateOne("tables", {_id}, {
            urlId,
            name,
            nsfw: nsfw || false,
            description: description || ""
        })
    }

    return await updateOne("tables", {_id}, {
        urlId,
        name,
        nsfw: nsfw || false,
        description: description || "",
        items: items || []
    })
}

export async function updateTableTabs(_id, tTabs) {
    if (!_id) {
        throw "Updating table tabs and no _id specified"
    }

    const allTabs = await getTabs()
    return await Promise.all(
        allTabs.map(
            async tab => {
                if (tab.tables.includes(_id)) {
                    if (!tTabs.includes(tab._id)) {
                        return await updateTabTables(tab._id, tab.tables.filter(c => c !== _id))
                    }
                } else if (tTabs.includes(tab._id)) {
                    return await updateTabTables(tab._id, tab.tables.concat([_id]))
                }
            }
        )
    )
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
    )) || []).sort((a, b) => a.name < b.name ? 1 : -1)
    return table
}

export async function deleteTable(_id) {
    return await deleteOne("tables", {_id})
}
