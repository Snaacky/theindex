import { count, deleteOne, findOne, getAll, insert, updateOne } from './db'
import { getCollections, updateCollection } from './collections'
import { getUsers, updateUser } from './users'
import { getLists } from './lists'

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
    throw 'Adding item and no name specified'
  }

  return await insert('items', {
    name,
    urls: urls || [],
    nsfw: nsfw || false,
    description: description || '',
    blacklist: blacklist || false,
    sponsor: sponsor || false,
    data: data || {},
  })
}

export async function updateItem(
  _id,
  { name, urls, nsfw, description, blacklist, sponsor, data }
) {
  if (!_id) {
    throw 'Updating item and no _id specified'
  }

  let _data = {}
  if (name) {
    _data.name = name
  }
  if (urls) {
    _data.urls = urls
  }
  if (typeof nsfw !== 'undefined') {
    _data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    _data.description = description
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

  return await updateOne('items', { _id }, _data)
}

export async function updateItemCollections(_id, iCollections) {
  if (!_id) {
    throw 'Updating item collections and no _id specified'
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
  // remove item from all user favs
  const allUsers = await getUsers()
  await Promise.all(
    allUsers.map(async (user) => {
      if (user.favs.includes(_id)) {
        return await updateUser(user._id, {
          favs: user.favs.filter((c) => c !== _id),
        })
      }
    })
  )

  // remove item from all user lists
  const allLists = await getLists()
  await Promise.all(
    allLists.map(async (list) => {
      if (list.items.includes(_id)) {
        return await updateUser(list._id, {
          items: list.items.filter((c) => c !== _id),
        })
      }
    })
  )

  // remove item from all collections
  const allCollections = await getCollections()
  await Promise.all(
    allCollections.map(async (collection) => {
      if (collection.items.includes(_id)) {
        return await updateCollection(collection._id, {
          items: collection.items.filter((c) => c !== _id),
        })
      }
    })
  )

  return await deleteOne('items', { _id })
}
