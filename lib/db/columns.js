import { deleteOne, find, findOne, getAll, insert, updateOne } from './db'
import { getCollections, updateCollection } from './collections'
import { updateList } from './lists'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'

export async function getColumns() {
  return await getAll('columns')
}

export async function getColumn(_id) {
  return await findOne('columns', { _id })
}

export async function addColumn(urlId, name, nsfw, description, type, values) {
  if (!urlId || !name || !type) {
    throw Error('Adding column and no urlId, type or name specified')
  }

  const newId = await insert('columns', {
    urlId,
    name: name.trim(),
    nsfw: nsfw || false,
    description: (description || '').trim(),
    type,
    values: values || [],
  })
  await updateSingleCache(Types.column, newId)
  await updateAllCache(Types.column)
  return newId
}

export async function updateColumn(
  _id,
  { urlId, name, nsfw, description, type, values }
) {
  if (!_id) {
    throw Error('Updating column and no _id specified')
  }

  let data = {}
  if (urlId) {
    data.urlId = urlId
  }
  if (name) {
    data.name = name.trim()
  }
  if (typeof nsfw !== 'undefined') {
    data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    data.description = description.trim()
  }
  if (type) {
    data.type = type
  }
  if (values) {
    data.values = values
  }

  await updateOne('columns', { _id }, data)
  await updateSingleCache(Types.column, _id)
}

export async function updateColumnCollections(_id, cCollections) {
  if (!_id) {
    throw Error('Updating column collections and no _id specified')
  }

  const allCollections = await getCollections()
  return await Promise.all(
    allCollections.map(async (collection) => {
      if (collection.columns.includes(_id)) {
        if (!cCollections.includes(collection._id)) {
          return await updateCollection(collection._id, {
            columns: collection.columns.filter((c) => c !== _id),
          })
        }
      } else if (cCollections.includes(collection._id)) {
        return await updateCollection(collection._id, {
          columns: collection.columns.concat([_id]),
        })
      }
    })
  )
}

export async function deleteColumn(_id) {
  // remove column entry from collections
  const collectionsWithColumn = (
    await find('collections', {
      columns: [_id],
    })
  ).map((collection) => {
    collection.columns = collection.columns.filter((column) => column !== _id)
    return collection
  })

  await Promise.all(
    collectionsWithColumn.map(async (collection) => {
      await updateCollection(collection._id, {
        columns: collection.columns,
      })
    })
  )

  // remove column entry from lists
  const listsWithColumn = (
    await find('lists', {
      columns: [_id],
    })
  ).map((list) => {
    list.columns = list.columns.filter((column) => column !== _id)
    return list
  })

  await Promise.all(
    listsWithColumn.map(async (list) => {
      await updateList(list._id, {
        columns: list.columns,
      })
    })
  )

  // update cache
  const collections = await getAll('collections')
  await updateAllCache(Types.collection, collections)
  collectionsWithColumn.map(async (collection) => {
    await updateSingleCache(Types.collection, collection)
  })
  const lists = await getAll('lists')
  await updateAllCache(Types.list, lists)
  listsWithColumn.map(async (list) => {
    await updateSingleCache(Types.list, list)
  })

  // remove column
  await deleteOne('columns', { _id })
  await clearSingleCache(Types.column, _id)
  await updateAllCache(Types.column)
}
