import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"
import {getTabs, updateTab} from "./tabs"

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

export async function updateTable(_id, {urlId, name, nsfw, description, columns, items}) {
    if (!_id) {
        throw "Updating table and no _id specified"
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
    if (columns) {
        data.columns = columns
    }
    if (items) {
        data.items = items
    }
    return await updateOne("tables", {_id}, data)

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
                        return await updateTab(tab._id, {
                            tables: tab.tables.filter(c => c !== _id)
                        })
                    }
                } else if (tTabs.includes(tab._id)) {
                    return await updateTab(tab._id, {
                        tables: tab.tables.concat([_id])
                    })
                }
            }
        )
    )
}

export async function deleteTable(_id) {
    return await deleteOne("tables", {_id})
}
