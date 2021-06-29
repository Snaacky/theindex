import {asyncSetIsMember, asyncSetMembers} from "./redis";


export async function getTablesWithItem(id) {
    let result = []
    for (const table in await getTables()) {
        if (await asyncSetIsMember("table:" + table, id)) {
            result.push(table)
        }
    }
    return result
}

export async function getTables() {
    return await asyncSetMembers("tables")
}

export async function getTableItems(id) {
    return await asyncSetMembers("table:" + id)
}