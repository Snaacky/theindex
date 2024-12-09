// docker run --name index-db -d -p 27017:27017 mongo
import { MongoClient } from 'mongodb'
import { hasOwnProperty } from '../utils'
import { cleanId, polluteId } from './utils'

const uri =
  'DATABASE_URL' in process.env
    ? process.env.DATABASE_URL
    : 'mongodb://localhost'
if (typeof uri !== 'string') {
  throw Error('Unable to connect to DB due to missing DATABASE_URL')
}

export const dbClient = () => new MongoClient(uri, { maxPoolSize: 5 })

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

export async function getAll(collection: string): Promise<object[]> {
  const client = await dbClient().connect()
  const db = client.db('index')
  let data = await db.collection(collection).find().toArray()
  client.close()
  if (data.length > 0 && hasOwnProperty(data[0], 'name')) {
    data = data.sort((a, b) => (a.name < b.name ? -1 : 1))
  }

  return cleanId(data)
}

export async function find(
  collection: string,
  query: Record<string, any>
): Promise<object[]> {
  const client = await dbClient().connect()
  const db = client.db('index')
  const data = await db.collection(collection).find(polluteId(query)).toArray()
  client.close()
  return cleanId(data)
}

export async function findOne(
  collection: string,
  query: Record<string, any>
): Promise<object | null> {
  const client = await dbClient().connect()
  const db = client.db('index')
  const found = await db.collection(collection).findOne(polluteId(query))
  client.close()
  if (found === null) {
    return null
  }
  return cleanId(found)
}

export async function count(
  collection: string,
  query: Record<string, any> = {}
): Promise<number> {
  const client = await dbClient().connect()
  const db = client.db('index')
  const data = await db.collection(collection).countDocuments(polluteId(query))
  client.close()
  return data
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
  const client = await dbClient().connect()
  let tries = 1
  while (tries < 3) {
    try {
      const db = client.db('index')
      data.createdAt = new Date()
      data.lastModified = new Date()
      const { insertedId } = await db.collection(collection).insertOne(data)
      client.close()
      return insertedId.toString()
    } catch (error) {
      console.error(
        '#' +
          tries.toString() +
          ': Failed to insert into collection ' +
          collection
      )
      tries++
    }
  }
  client.close()
  throw Error('Unable to insert entry into ' + collection + ' after 3 retires')
}

export async function updateOne(
  collection: string,
  query: Record<string, any>,
  data: Record<string, any>
) {
  const client = await dbClient().connect()
  let tries = 1
  while (tries < 3) {
    try {
      const db = client.db('index')
      await db.collection(collection).updateOne(polluteId(query), {
        $set: data,
        $currentDate: { lastModified: true },
      })
      client.close()
      return
    } catch (error) {
      console.error(
        '#' + tries.toString() + ': Failed to update collection ' + collection
      )
      tries++
    }
  }
  client.close()
  throw Error('Unable to update entry of ' + collection + ' after 3 retires')
}

export async function deleteOne(
  collection: string,
  query: Record<string, any>
) {
  const client = await dbClient().connect()
  let tries = 1
  while (tries < 3) {
    try {
      const db = client.db('index')
      await db.collection(collection).deleteOne(polluteId(query))
      client.close()
      return
    } catch (error) {
      console.error(
        '#' +
          tries.toString() +
          ': Failed to delete from collection ' +
          collection
      )
      tries++
    }
  }
  client.close()
  throw Error('Unable to delete entry from ' + collection + ' after 3 retires')
}
