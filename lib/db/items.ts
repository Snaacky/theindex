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
import {
  clearSingleCache,
  getSingleCache,
  updateAllCache,
  updateSingleCache,
} from './cache'
import { Types } from '../../types/Components'
import { Item, ItemUpdate } from '../../types/Item'
import { User } from '../../types/User'
import { List } from '../../types/List'
import { updateList } from './lists'
import { Collection } from '../../types/Collection'
import { postItemUpdate } from '../webhook'

export async function getItems(): Promise<Item[]> {
  return await Promise.all(
    ((await getAll('items')) as Item[]).map(async (i) => {
      i.stars = await count('users', { favs: [i._id] })
      return i
    })
  )
}

export async function getItem(_id: string): Promise<Item | null> {
  const item = (await findOne('items', { _id: _id })) as Item
  if (item !== null) {
    item.stars = await count('users', { favs: [_id] })
  }
  return item
}

export async function addItem(
  name: string,
  urls: string,
  nsfw: boolean = false,
  description: string = '',
  blacklist: boolean = false,
  sponsor: boolean = false,
  data: Record<string, boolean | string | string[]>,
  user?: User
): Promise<string> {
  if (!name) {
    throw Error('Adding item and no name specified')
  }

  const newId = await insert('items', {
    name: name.trim(),
    urls: urls || [],
    nsfw: nsfw || false,
    description: (description || '').trim(),
    blacklist: blacklist || false,
    sponsor: sponsor || false,
    data: data || {},
  })
  await updateSingleCache(Types.item, newId)
  await updateAllCache(Types.item)

  if (user) {
    await postItemUpdate(
      user,
      null,
      (await getSingleCache(Types.item, newId)) as Item
    )
  }
  return newId
}

export async function updateItem(
  _id,
  { name, urls, nsfw, description, blacklist, sponsor, data }: ItemUpdate,
  user?: User
) {
  if (!_id) {
    throw Error('Updating item and no _id specified')
  }

  let _data: Record<string, any> = {}
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

  const oldItem = (await getSingleCache(Types.item, _id)) as Item

  await updateOne('items', { _id }, _data)
  await updateSingleCache(Types.item, _id)
  if (user) {
    await postItemUpdate(
      user,
      oldItem,
      (await getSingleCache(Types.item, _id)) as Item
    )
  }
}

export async function updateItemCollections(
  _id: string,
  iCollections: string[]
) {
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

export async function deleteItem(_id: string, user?: User) {
  // remove item entry from favs
  const usersWithFav = (
    (await find('users', {
      favs: [_id],
    })) as User[]
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
    (await find('lists', {
      items: [_id],
    })) as List[]
  ).map((list) => {
    list.items = list.items.filter((t) => t !== _id)
    return list
  })
  await Promise.all(
    listsWithItem.map(async (list) => {
      await updateList(list._id, {
        items: list.items,
      })
    })
  )

  // remove item entry from collections
  const collectionsWithItem = (
    (await find('collections', {
      items: [_id],
    })) as Collection[]
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
  usersWithFav.map(async (user) => {
    await updateSingleCache(Types.user, user.uid)
  })
  listsWithItem.map(async (list) => {
    await updateSingleCache(Types.list, list._id)
  })
  collectionsWithItem.map(async (collection) => {
    await updateSingleCache(Types.collection, collection._id)
  })
  await updateAllCache(Types.user)
  await updateAllCache(Types.collection)
  await updateAllCache(Types.list)

  const oldItem = (await getSingleCache(Types.item, _id)) as Item
  // remove item
  await deleteOne('items', { _id })
  await clearSingleCache(Types.item, _id)
  await updateAllCache(Types.item)

  if (user) {
    await postItemUpdate(user, oldItem, null)
  }
}
