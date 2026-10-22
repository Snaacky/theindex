import type { Collection } from '../../types/Collection'
import type { Column } from '../../types/Column'
import type { Item } from '../../types/Item'
import type { Library } from '../../types/Library'
import type { List } from '../../types/List'
import type { User } from '../../types/User'
import { find, findOne, getAll } from './db'
import { getSingleCache } from './cache'
import { Types } from '../../types/Components'

type MenuCollection = Pick<Collection, '_id' | 'urlId' | 'name'>
type MenuLibraryRecord = Pick<Library, '_id' | 'urlId' | 'name'> & {
  collections: string[]
}

export type MenuLibrary = Pick<Library, '_id' | 'urlId' | 'name'> & {
  collections: MenuCollection[]
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids.filter((id) => typeof id === 'string' && id)))
}

function reorderByIds<T extends { _id: string }>(records: T[], ids: string[]) {
  const byId = new Map(records.map((record) => [record._id, record]))
  return uniqueIds(ids)
    .map((id) => byId.get(id))
    .filter((record): record is T => typeof record !== 'undefined')
}

async function findByIds<T extends { _id: string }>(
  collection: string,
  ids: string[]
) {
  const unique = uniqueIds(ids)
  if (unique.length === 0) {
    return [] as T[]
  }

  return reorderByIds(
    (await find(collection, { _id: { $in: unique } })) as T[],
    unique
  )
}

export async function getAllUserIds() {
  return (await getAll('users', {
    projection: { uid: 1 },
    sort: { uid: 1 },
  })) as Array<Pick<User, 'uid'>>
}

export async function getAllListIds() {
  return (await getAll('lists', {
    projection: { _id: 1 },
    sort: { createdAt: -1 },
  })) as Array<Pick<List, '_id'>>
}

export async function getItemsByIds(ids: string[]) {
  return await findByIds<Item>('items', ids)
}

export async function getCollectionsByIds(ids: string[]) {
  return await findByIds<Collection>('collections', ids)
}

export async function getLibrariesByIds(ids: string[]) {
  return await findByIds<Library>('libraries', ids)
}

export async function getListsByIds(ids: string[]) {
  return await findByIds<List>('lists', ids)
}

export async function getColumnsByIds(ids: string[]) {
  return await findByIds<Column>('columns', ids)
}

export async function getColumnsForItems(items: Item[]) {
  const columnIds = uniqueIds(
    items.flatMap((item) => Object.keys(item.data || {}))
  )
  return await getColumnsByIds(columnIds)
}

export async function getItemsForColumn(columnId: string) {
  return (await find('items', {
    [`data.${columnId}`]: { $exists: true },
  })) as Item[]
}

export async function getCollectionsForItem(itemId: string) {
  return (await find(
    'collections',
    { items: itemId },
    {
      projection: { _id: 1, urlId: 1, name: 1 },
      sort: { name: 1 },
    }
  )) as MenuCollection[]
}

export async function getLibrariesForCollection(collectionId: string) {
  return (await find(
    'libraries',
    { collections: collectionId },
    {
      projection: { _id: 1, urlId: 1, name: 1 },
      sort: { name: 1 },
    }
  )) as Array<Pick<Library, '_id' | 'urlId' | 'name'>>
}

export async function getListsForUser(uid: string) {
  return (await find('lists', { owner: uid }, { sort: { createdAt: -1 } })) as List[]
}

export async function getFollowedListsForUser(user: User) {
  return await getListsByIds(user.followLists || [])
}

export async function getItemById(itemId: string) {
  return (await getSingleCache(Types.item, itemId)) as Item | null
}

export async function getUserByUid(uid: string) {
  return (await getSingleCache(Types.user, uid)) as User | null
}

export async function getListById(listId: string) {
  return (await findOne('lists', { _id: listId })) as List | null
}

export async function getMenuData() {
  const [libraries, collections] = await Promise.all([
    getAll('libraries', {
      projection: { _id: 1, urlId: 1, name: 1, collections: 1, order: 1 },
      sort: { order: 1, name: 1 },
    }) as Promise<MenuLibraryRecord[]>,
    getAll('collections', {
      projection: { _id: 1, urlId: 1, name: 1 },
      sort: { name: 1 },
    }) as Promise<MenuCollection[]>,
  ])

  const collectionsById = new Map(
    collections.map((collection) => [collection._id, collection])
  )

  return libraries.map((library) => ({
    _id: library._id,
    urlId: library.urlId,
    name: library.name,
    collections: library.collections
      .map((collectionId) => collectionsById.get(collectionId))
      .filter(
        (collection): collection is MenuCollection =>
          typeof collection !== 'undefined'
      ),
  })) as MenuLibrary[]
}
