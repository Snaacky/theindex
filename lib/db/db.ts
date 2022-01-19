// docker run --name index-db -d -p 27017:27017 mongo
import { MongoClient, ObjectId } from 'mongodb'
import { hasOwnProperty } from '../utils'
import { Types } from '../../types/Components'

export function getClient() {
  const uri =
    'DATABASE_URL' in process.env
      ? process.env.DATABASE_URL
      : 'mongodb://localhost'
  return new MongoClient(uri, { maxPoolSize: 5, useUnifiedTopology: true })
}

export async function importData(data: Record<string, any>) {
  for (const [key, value] of Object.entries(data)) {
    await insertMany(key, value)
  }
}

export async function exportData(isAdmin = false) {
  if (isAdmin) {
    return {
      collections: await getAll('collections'),
      columns: await getAll('columns'),
      items: await getAll('items'),
      libraries: await getAll('libraries'),
      lists: await getAll('lists'),
      users: await getAll('users'),
    }
  }

  return {
    collections: await getAll('collections'),
    columns: await getAll('columns'),
    items: await getAll('items'),
    libraries: await getAll('libraries'),
  }
}

export function cleanId(data: Record<string, any>) {
  if (typeof data !== 'undefined' && data !== null) {
    if (Array.isArray(data)) {
      return data.map((d) => cleanId(d))
    }
    if (hasOwnProperty(data, '_id')) {
      data._id = data._id.toString()
    }
    if (hasOwnProperty(data, 'lastModified')) {
      data.lastModified = data.lastModified.toString()
    }
    if (hasOwnProperty(data, 'createdAt')) {
      data.createdAt = data.createdAt.toString()
    }
  }
  return data
}

export function polluteId(query: Record<string, any>) {
  if (typeof query !== 'undefined') {
    if (hasOwnProperty(query, '_id') && typeof query._id === 'string') {
      query._id = ObjectId(query._id)
    }
    if (
      hasOwnProperty(query, 'lastModified') &&
      typeof query.lastModified === 'string'
    ) {
      query.lastModified = new Date(query.lastModified)
    }
  }
  return query
}

export async function getAll(collection: string): Promise<object[]> {
  let data = []
  const client = getClient()
  try {
    await client.connect()
    const db = client.db('index')
    data = await db.collection(collection).find().toArray()
    if (data.length > 0 && hasOwnProperty(data[0], 'name')) {
      data = data.sort((a, b) => (a.name < b.name ? -1 : 1))
    }
  } finally {
    await client.close()
  }
  return cleanId(data)
}

export async function find(
  collection: string,
  query: Record<string, any>
): Promise<object[]> {
  let data = []
  const client = getClient()
  try {
    query = polluteId(query)
    await client.connect()
    const db = client.db('index')
    data = await db.collection(collection).find(query).toArray()
  } finally {
    await client.close()
  }
  return cleanId(data)
}

export async function findOne(
  collection: string,
  query: Record<string, any>
): Promise<object | null> {
  let data = []
  const client = getClient()
  try {
    query = polluteId(query)
    await client.connect()
    const db = client.db('index')
    data = await db.collection(collection).findOne(query)
  } finally {
    await client.close()
  }
  return cleanId(data)
}

export async function count(
  collection: string,
  query: Record<string, any> = {}
): Promise<number> {
  const client = getClient()
  let data
  try {
    query = polluteId(query)
    await client.connect()
    const db = client.db('index')
    data = await db.collection(collection).countDocuments(query)
  } finally {
    await client.close()
  }
  return cleanId(data)
}

export async function getByUrlId(
  collection: string,
  urlId: string
): Promise<object | null> {
  return await findOne(collection, { urlId })
}

export async function insert(
  collection: string,
  data: Record<string, any>
): Promise<string> {
  const client = getClient()
  try {
    await client.connect()
    const db = client.db('index')
    data.createdAt = new Date()
    data.lastModified = new Date()
    const { insertedId } = await db.collection(collection).insertOne(data)
    return insertedId.toString()
  } finally {
    await client.close()
  }
}

export async function insertMany(
  collection: string,
  data: Record<string, any>
) {
  const client = getClient()
  try {
    await client.connect()
    const db = client.db('index')
    data.forEach((d) => {
      d.lastModified = new Date()
      d.createdAt = d.lastModified
    })
    await db.collection(collection).insertMany(data)
  } finally {
    await client.close()
  }
}

export async function updateOne(
  collection: string,
  query: Record<string, any>,
  data: Record<string, any>
) {
  const client = getClient()
  try {
    query = polluteId(query)
    await client.connect()
    const db = client.db('index')
    await db.collection(collection).updateOne(query, {
      $set: data,
      $currentDate: { lastModified: true },
    })
  } finally {
    await client.close()
  }
}

export async function deleteOne(
  collection: string,
  query: Record<string, any>
) {
  const client = getClient()
  try {
    query = polluteId(query)
    await client.connect()
    const db = client.db('index')
    await db.collection(collection).deleteOne(query)
  } finally {
    await client.close()
  }
}
