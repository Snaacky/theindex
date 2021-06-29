/**import {RedisClient} from 'redis'
import {promisify} from 'util'

// for dev purposes run redis via:
// docker run -d -p 6379:6379 --name index-redis redis
const client = RedisClient.createClient()

// show errors
client.on("error", function (error) {
    console.error(error);
});

// async wrapper
export const asyncHGetAll = promisify(client.hgetall).bind(client)
export const asyncHGet = promisify(client.hget).bind(client)
export const asyncHSet = promisify(client.hset).bind(client)
export const asyncHDel = promisify(client.hdel).bind(client)

export const asyncSetMembers = promisify(client.smembers).bind(client)
export const asyncSetAdd = promisify(client.sadd).bind(client)
export const asyncSetRem = promisify(client.srem).bind(client)
export const asyncSetIsMember = promisify(client.sismember).bind(client)

client.sismember()
/**
 * Data-Structure of redis database:
 *
 * Set:
 * - items, list of all item ids
 * - tables, list of all table ids
 * - table:{id}, list of all item ids in table
 * - users, list of all user ids
 * - sponsors, list of item ids, that are sponsors
 *
 * Hashmaps:
 * - table:{id}, info about table
 * - item:{id}, info about item
 * - user:{id}, info about user
 */
