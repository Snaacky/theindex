// docker run --name index-cache -d -p 6379:6379 redis
import * as Redis from 'ioredis'
import * as process from 'process'
import { Types } from '../../types/Components'
import { findOne, getAll, singularToPlural } from './db'

const uri =
  'CACHE_URL' in process.env ? process.env.CACHE_URL : 'redis://localhost'
const client = new Redis(uri)

/**
 * only returns null if requested component does not exist
 * @param type: Types, type of component
 * @param _id: string, unique _id or uid for user
 * @param parse: boolean, should the result be parsed to an object
 */
export async function getSingleCache(
  type: Types,
  _id: string,
  parse = true
): Promise<string | object> {
  let data = await getCache(type + '-' + _id, parse)
  if (data === null) {
    const search = type === Types.user ? { uid: _id } : { _id: _id }
    data = await findOne(singularToPlural(type), search)
    if (data === null) {
      return null
    }

    updateSingleCache(type, _id, data)
    if (!parse) {
      return JSON.stringify(data)
    }
  }

  return data
}

/**
 * wrapper for setCache, ensuring consistent key naming
 * @param type: Types, type of component
 * @param _id: string, unique _id or uid for user
 * @param data: string | object, to be cached
 */
export async function updateSingleCache(
  type: Types,
  _id: string,
  data?: string | object
) {
  if (typeof data === 'undefined') {
    const search = type === Types.user ? { uid: _id } : { _id: _id }
    data = await findOne(singularToPlural(type), search)
  }

  setCache(type + '-' + _id, data)
}

/**
 * only returns null if requested components do not exist or are empty
 * @param type: Types, type of component
 * @param parse: boolean, should the result be parsed to an object
 */
export async function getAllCache(
  type: Types,
  parse = true
): Promise<string | object> {
  const plural = singularToPlural(type)

  let data = await getCache(plural, parse)
  if (data === null) {
    data = await getAll(plural)
    if (data === null) {
      return null
    }

    setCache(plural, data)
    if (!parse) {
      return JSON.stringify(data)
    }
  }

  return data
}

/**
 * wrapper for setCache, ensuring consistent key naming
 * @param type: Types, type of component
 * @param data: string | object, to be cached
 */
export async function updateAllCache(type: Types, data?: string | object) {
  if (typeof data === 'undefined') {
    data = await getAll(singularToPlural(type))
  }

  setCache(singularToPlural(type), data)
}

/**
 * only returns null if requested component does not exist
 * @param key: string, unique key, should not collide with keys from getSingleCache and getAllCache
 * @param parse: boolean, should the result be parsed to an object
 */
export async function getCache(
  key: string,
  parse = true
): Promise<string | object> {
  let data = await client.get(key)

  if (parse && data !== null) {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Failed to parse data from cache', data)
    }
  }
  return data
}

/**
 * only returns null if requested component does not exist
 * @param key: string, unique key, should not collide with keys from getSingleCache and getAllCache
 * @param data: string | object, data to be stored as JSON formated string
 */
export function setCache(key: string, data: string | object) {
  if (typeof data === 'undefined' || data === null) {
    console.error('Updating cache', key, 'with invalid value', data)
  }

  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }

  return client.set(key, data).then(() => {
    console.info('Created cache for', key)
  })
}
