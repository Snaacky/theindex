// docker run --name index-cache -d -p 6379:6379 redis
import Redis from 'ioredis'
import * as process from 'process'
import { Types } from '../../types/Components'
import { findOne, getAll } from './db'

import { getUser, getUsers } from './users'
import { getItem } from './items'
import { singularToPlural } from '../utils'

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
    if (type === Types.user) {
      data = await getUser(_id)
    } else if (type === Types.item) {
      data = await getItem(_id)
    } else {
      data = await findOne(singularToPlural(type), { _id: _id })
    }

    if (data === null) {
      return null
    }

    await updateSingleCache(type, _id, data)
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
    if (type === Types.user) {
      data = await getUser(_id)
    } else {
      data = await findOne(singularToPlural(type), { _id: _id })
    }
  }

  await setCache(type + '-' + _id, data)
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
    if (type === Types.user) {
      data = await getUsers()
    } else {
      data = await getAll(plural)
    }
    if (data === null) {
      return null
    }

    await setCache(plural, data)
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
    if (type === Types.user) {
      data = await getUsers()
    } else {
      data = await getAll(singularToPlural(type))
    }
  }

  await setCache(singularToPlural(type), data)
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
 * @param data: string | object, data to be stored as JSON formatted string
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

export async function clearSingleCache(type: Types, _id: string) {
  return await clearCache(type + '-' + _id)
}

export async function clearCache(key: string) {
  return await client.del(key)
}

export function clearCompleteCache() {
  return client
    .flushall()
    .catch((e) => console.error('Failed to flush cache', e))
}
