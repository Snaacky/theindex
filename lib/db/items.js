import {
  count,
  deleteOne,
  find,
  findOne,
  getAll,
  insert,
  updateOne,
} from './db'
import { getCollections, updateCollection } from './collections'
import { updateUser } from './users'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'

export async function getItems() {
  return await Promise.all(
    (
      await getAll('items')
    ).map(async (i) => {
      i.stars = await count('users', { favs: i._id })
      return i
    })
  )
}

export async function getItem(_id) {
  const item = await findOne('items', { _id: _id })
  if (item) {
    item.stars = await count('users', { favs: _id })
  }
  return item
}

export async function addItem(
  name,
  urls,
  nsfw,
  description,
  blacklist,
  sponsor,
  data
) {
  if (!name) {
    throw Error('Adding item and no name specified')
  }

  const newId = await insert('items', {
    name: name.trim(),
    urls: urls || [],
    nsfw: nsfw || false,
    description: description.trim() || '',
    blacklist: blacklist || false,
    sponsor: sponsor || false,
    data: data || {},
  })
  await updateSingleCache(Types.item, newId)
  await updateAllCache(Types.item)
  return newId
}

export async function updateItem(
  _id,
  { name, urls, nsfw, description, blacklist, sponsor, data }
) {
  if (!_id) {
    throw Error('Updating item and no _id specified')
  }

  let _data = {}
  if (name) {
    _data.name = name.trim()
  }
  if (urls) {
    _data.urls = urls
  }
  if (typeof nsfw !== 'undefined') {
    _data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    _data.description = description.trim()
  }
  if (typeof blacklist !== 'undefined') {
    _data.blacklist = blacklist
  }
  if (typeof sponsor !== 'undefined') {
    _data.sponsor = sponsor
  }
  if (data) {
    _data.data = data
  }

  console.log('Updating item with', _data)

  await updateOne('items', { _id }, _data)
  await updateSingleCache(Types.item, _id)
}

export async function updateItemCollections(_id, iCollections) {
  if (!_id) {
    throw Error('Updating item collections and no _id specified')
  }

  const allCollections = await getCollections()
  return await Promise.all(
    allCollections.map(async (collection) => {
      if (collection.items.includes(_id)) {
        if (!iCollections.includes(collection._id)) {
          return await updateCollection(collection._id, {
            items: collection.items.filter((c) => c !== _id),
          })
        }
      } else if (iCollections.includes(collection._id)) {
        return await updateCollection(collection._id, {
          items: collection.items.concat([_id]),
        })
      }
    })
  )
}

export async function deleteItem(_id) {
  // remove item entry from favs
  const usersWithFav = (
    await find('users', {
      favs: [_id],
    })
  ).map((user) => {
    user.favs = user.favs.filter((t) => t !== _id)
    return user
  })

  await Promise.all(
    usersWithFav.map(async (user) => {
      await updateUser(user.uid, {
        favs: user.favs,
      })
    })
  )

  // remove item entry from user lists
  const listsWithItem = (
    await find('lists', {
      items: [_id],
    })
  ).map((list) => {
    list.items = list.items.filter((t) => t !== _id)
    return list
  })
  await Promise.all(
    listsWithItem.map(async (list) => {
      await updateUser(list._id, {
        items: list.items,
      })
    })
  )

  // remove item entry from collections
  const collectionsWithItem = (
    await find('collections', {
      items: [_id],
    })
  ).map((collection) => {
    collection.items = collection.items.filter((t) => t !== _id)
    return collection
  })
  await Promise.all(
    collectionsWithItem.map(async (collection) => {
      await updateCollection(collection._id, {
        items: collection.items,
      })
    })
  )

  // update cache
  const users = await getAll('users')
  await updateAllCache(Types.user, users)
  usersWithFav.map(async (user) => {
    await updateSingleCache(Types.user, user)
  })
  const lists = await getAll('lists')
  await updateAllCache(Types.list, lists)
  listsWithItem.map(async (list) => {
    await updateSingleCache(Types.list, list)
  })
  const collections = await getAll('collections')
  await updateAllCache(Types.collection, collections)
  collectionsWithItem.map(async (collection) => {
    await updateSingleCache(Types.collection, collection)
  })

  // remove item
  await deleteOne('items', { _id })
  await clearSingleCache(Types.item, _id)
  await updateAllCache(Types.item)
}
