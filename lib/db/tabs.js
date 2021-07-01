import {addEntry, find, getAll} from "./db";

export function getTabs() {
    return getAll("tabs")
    // return readJSON("data.json")
}

export function addTab(id, title, nsfw, description) {
    addEntry("tabs", {id, title, nsfw, description})
}

export async function getTablesOfTab(id) {
    return await find("tables", {tabs: id})
}
