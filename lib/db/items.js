import {insert, getAll} from "./db";

/**
 * Item-Structure:
 * item:{id}:
 * - string name
 * - string id
 * - string urls, json encoded list
 * - string data, json encoded object
 * - int    upvote
 * - int    downvote
 *
 */

export async function getItems() {
    return await getAll("items")
}

export function addItem(url_id, title, urls, nsfw, description, tables, data) {
    insert("items", {
        url_id,
        title,
        urls,
        nsfw,
        description,
        tables,
        data
    })
}
