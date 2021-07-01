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

/**
 * Returns a list of all item ids
 * @returns {Promise<*>}
 export async function getItems() {
    return await asyncSetMembers("items")
}
 */

/**
 * Adds item to item list
 * @param id
 * @returns {Promise<*>}
 export async function addItem(id) {
    return await asyncSetAdd("items", id)
}
 */

/**
 * Removes item from items list
 * @param id
 * @returns {Promise<*>}
 export async function deleteItem(id) {
    await asyncHDel("item:" + id)
    return await asyncSetRem("items", id)
}
 */

/**
 * Returns info about an item
 * @param id
 * @returns {Promise<*>}
 export async function getItem(id) {
    return await asyncHGetAll("item:" + id)
}
 */
