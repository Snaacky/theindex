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
 */
export async function getSingleCache(
  type: Types,
  _id: string
): Promise<string | object> {
  let data = await getCache(type + '-' + _id)
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
    return JSON.stringify(data)
  }

  return data
}

/**
 * wrapper for setCache, ensuring consistent key naming
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
 */
export async function getAllCache(type: Types): Promise<object[]> {
  const plural = singularToPlural(type)

  let data = await getCache(plural)
  if (data === null) {
    if (type === Types.user) {
      data = await getUsers()
    } else {
      data = await getAll(plural)
    }
    if (data === null) {
      return []
    }

    await setCache(plural, data)
  }

  return data as object[]
}

/**
 * wrapper for setCache, ensuring consistent key naming
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
 */
export async function getCache(key: string): Promise<object | object[]> {
  try {
    let data = await client.get(key)
    if (data === null) {
      return null
    }

    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Failed to parse data from cache', data, e)
    }
  } catch (e) {
    console.error('Failed to get from cache', e)
  }
}

/**
 * only returns null if requested component does not exist
 */
export function setCache(key: string, data: string | object) {
  if (typeof data === 'undefined' || data === null) {
    console.error('Updating cache', key, 'with invalid value', data)
  }

  if (typeof data !== 'string') {
    try {
      data = JSON.stringify(data)
    } catch (e) {
      return console.error('Failed to stringify data to set cache', data)
    }
  }

  try {
    return client.set(key, data)
  } catch (e) {
    console.error('Failed to set cache for key', key, data)
  }
}

export async function clearSingleCache(type: Types, _id: string) {
  return await clearCache(type + '-' + _id)
}

export async function clearCache(key: string) {
  try {
    return await client.del(key)
  } catch (e) {
    console.error('Failed te delete cache', key, e)
  }
}

export async function clearCompleteCache() {
  try {
    return await client.flushall()
  } catch (e) {
    return console.error('Failed to flush cache', e)
  }
}
