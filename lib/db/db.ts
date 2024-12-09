// docker run --name index-db -d -p 27017:27017 mongo
import { hasOwnProperty } from '../utils'
import { cleanId, polluteId } from './utils'
import clientPromise from './mongoDB'

const uri =
  'DATABASE_URL' in process.env
    ? process.env.DATABASE_URL
    : 'mongodb://localhost'
if (typeof uri !== 'string') {
  throw Error('Unable to connect to DB due to missing DATABASE_URL')
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

export async function getAll(collection: string): Promise<object[]> {
  const db = (await clientPromise).db('index')
  let data = await db.collection(collection).find().toArray()
  if (data.length > 0 && hasOwnProperty(data[0], 'name')) {
    data = data.sort((a, b) => (a.name < b.name ? -1 : 1))
  }

  return cleanId(data)
}

export async function find(
  collection: string,
  query: Record<string, any>
): Promise<object[]> {
  const db = (await clientPromise).db('index')
  return cleanId(
    await db.collection(collection).find(polluteId(query)).toArray()
  )
}

export async function findOne(
  collection: string,
  query: Record<string, any>
): Promise<object | null> {
  const db = (await clientPromise).db('index')
  const found = await db.collection(collection).findOne(polluteId(query))
  if (found === null) {
    return null
  }
  return cleanId(found)
}

export async function count(
  collection: string,
  query: Record<string, any> = {}
): Promise<number> {
  const db = (await clientPromise).db('index')
  const data = await db.collection(collection).countDocuments(polluteId(query))
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
  let tries = 1
  while (tries < 3) {
    try {
      const db = (await clientPromise).db('index')
      data.createdAt = new Date()
      data.lastModified = new Date()
      const { insertedId } = await db.collection(collection).insertOne(data)
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
  throw Error('Unable to insert entry into ' + collection + ' after 3 retires')
}

export async function updateOne(
  collection: string,
  query: Record<string, any>,
  data: Record<string, any>
) {
  let tries = 1
  while (tries < 3) {
    try {
      const db = (await clientPromise).db('index')
      await db.collection(collection).updateOne(polluteId(query), {
        $set: data,
        $currentDate: { lastModified: true },
      })
      return
    } catch (error) {
      console.error(
        '#' + tries.toString() + ': Failed to update collection ' + collection
      )
      tries++
    }
  }
  throw Error('Unable to update entry of ' + collection + ' after 3 retires')
}

export async function deleteOne(
  collection: string,
  query: Record<string, any>
) {
  let tries = 1
  while (tries < 3) {
    try {
      const db = (await clientPromise).db('index')
      await db.collection(collection).deleteOne(polluteId(query))
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
  throw Error('Unable to delete entry from ' + collection + ' after 3 retires')
}
