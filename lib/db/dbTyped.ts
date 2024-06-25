import { Types } from '../../types/Components'
import {
  count,
  deleteOne,
  find,
  findOne,
  getAll,
  insert,
  updateOne,
} from './db'
import type { User, UserUpdate } from '../../types/User'
import type { List } from '../../types/List'
import type { Library } from '../../types/Library'
import type { Item } from '../../types/Item'
import type { Column } from '../../types/Column'
import type { Collection } from '../../types/Collection'
import { gatherUserInfo } from './users'
import { getSingleCache } from './cache'
import { getLastViews } from './views'

export async function getAllTyped(type: Types) {
  switch (type) {
    case Types.collection:
      return (await getAll('collections')) as Collection[]
    case Types.column:
      return (await getAll('columns')) as Column[]
    case Types.item:
      return (await getAll('items')) as Item[]
    case Types.library:
      return (await getAll('libraries')) as Library[]
    case Types.list:
      return (await getAll('lists')) as List[]
    case Types.user:
      const users = (await getAll('users')) as User[]
      return await Promise.all(
        users.map(
          async ({ uid }) => (await getSingleCache(Types.user, uid)) as User
        )
      )
  }
}

export async function findTyped(type: Types, query: Record<string, any>) {
  switch (type) {
    case Types.collection:
      return (await find('collections', query)) as Collection[]
    case Types.column:
      return (await find('columns', query)) as Column[]
    case Types.item:
      return (await find('items', query)) as Item[]
    case Types.library:
      return (await find('libraries', query)) as Library[]
    case Types.list:
      return (await find('lists', query)) as List[]
    case Types.user:
      return (await find('users', query)) as User[]
  }
}

export async function findOneTyped(
  type: Types,
  _id: string | Record<string, any>
) {
  switch (type) {
    case Types.collection:
      return (await findOne(
        'collections',
        typeof _id === 'string' ? { _id } : _id
      )) as Collection | null
    case Types.column:
      return (await findOne(
        'columns',
        typeof _id === 'string' ? { _id } : _id
      )) as Column | null
    case Types.item:
      const item = (await findOne(
        'items',
        typeof _id === 'string' ? { _id } : _id
      )) as Item | null
      if (item !== null) {
        item.stars = await countTyped(Types.user, { favs: [_id] })
        item.views = 0 // await count(Types.item, 1000)
      }
      return item
    case Types.library:
      return (await findOne(
        'libraries',
        typeof _id === 'string' ? { _id } : _id
      )) as Library | null
    case Types.list:
      return (await findOne(
        'lists',
        typeof _id === 'string' ? { _id } : _id
      )) as List | null
    case Types.user:
      const user = (await findOne(
        'users',
        typeof _id === 'string' ? { uid: _id } : _id
      )) as User | null
      return await gatherUserInfo(user)
  }
}

export async function countTyped(type: Types, query?: Record<string, any>) {
  switch (type) {
    case Types.collection:
      return await count('collections', query)
    case Types.column:
      return await count('columns', query)
    case Types.item:
      return await count('items', query)
    case Types.library:
      return await count('libraries', query)
    case Types.list:
      return await count('lists', query)
    case Types.user:
      return await count('users', query)
  }
}

export async function getByUrlIdTyped(type: Types, urlId: string) {
  return findOneTyped(type, { urlId })
}

export async function insertTyped(
  type: Types,
  data: UserUpdate | Record<string, any>
) {
  switch (type) {
    case Types.collection:
      return await insert('collections', data)
    case Types.column:
      return await insert('columns', data)
    case Types.item:
      return await insert('items', data)
    case Types.library:
      return await insert('libraries', data)
    case Types.list:
      return await insert('lists', data)
    case Types.user:
      return await insert('users', data)
  }
}

export async function updateOneTyped(
  type: Types,
  _id: string | Record<string, any>,
  data
) {
  switch (type) {
    case Types.collection:
      return await updateOne(
        'collections',
        typeof _id === 'string' ? { _id } : _id,
        data
      )
    case Types.column:
      return await updateOne(
        'columns',
        typeof _id === 'string' ? { _id } : _id,
        data
      )
    case Types.item:
      return await updateOne(
        'items',
        typeof _id === 'string' ? { _id } : _id,
        data
      )
    case Types.library:
      return await updateOne(
        'libraries',
        typeof _id === 'string' ? { _id } : _id,
        data
      )
    case Types.list:
      return await updateOne(
        'lists',
        typeof _id === 'string' ? { _id } : _id,
        data
      )
    case Types.user:
      return await updateOne(
        'users',
        typeof _id === 'string' ? { uid: _id } : _id,
        data
      )
  }
}

export async function deleteOneTyped(type: Types, query: Record<string, any>) {
  switch (type) {
    case Types.collection:
      return await deleteOne('collections', query)
    case Types.column:
      return await deleteOne('columns', query)
    case Types.item:
      return await deleteOne('items', query)
    case Types.library:
      return await deleteOne('libraries', query)
    case Types.list:
      return await deleteOne('lists', query)
    case Types.user:
      return await deleteOne('users', query)
  }
}
