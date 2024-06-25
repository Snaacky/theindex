import { deleteOne, find, findOne, getAll, insert, updateOne } from './db'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'
import { updateUser } from './users'
import type { List, ListUpdate } from '../../types/List'
import type { User } from '../../types/User'
import { findOneTyped } from './dbTyped'

export async function getLists(): Promise<List[]> {
  return (await getAll('lists')) as List[]
}

export async function getList(_id: string): Promise<List | null> {
  return (await findOne('lists', { _id })) as List
}

export async function addList(
  owner: string,
  name: string,
  nsfw: boolean = false,
  description: string = '',
  columns: string[] = [],
  items: string[] = []
): Promise<string> {
  if (!owner || !name) {
    throw Error('Adding list and no owner or name specified')
  }

  const newId = await insert('lists', {
    owner,
    name: name.trim(),
    nsfw: nsfw || false,
    description: (description || '').trim(),
    columns: columns || [],
    items: items || [],
  })
  await updateSingleCache(Types.list, newId)
  await updateAllCache(Types.list)
  return newId
}

export async function updateList(
  _id: string,
  { name, nsfw, description, columns, items }: ListUpdate
) {
  if (!_id) {
    throw Error('Updating list and no _id specified')
  }

  let data: Record<string, any> = {}
  if (name) {
    data.name = name.trim()
  }
  if (typeof nsfw !== 'undefined') {
    data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    data.description = description.trim()
  }
  if (columns) {
    data.columns = columns
  }
  if (items) {
    data.items = items
  }
  await updateOne('lists', { _id }, data)
  await updateSingleCache(Types.list, _id)
}

export async function deleteList(_id: string) {
  // remove list entry from owner
  const list = await getList(_id)
  const owner = (await findOneTyped(Types.user, list.owner)) as User
  owner.lists = owner.lists.filter((userList) => userList !== _id)

  await updateUser(owner.uid, {
    lists: owner.lists,
  })

  // remove list entry from user follows
  const usersWithFollow = (
    (await find('users', {
      followLists: [_id],
    })) as User[]
  ).map((user) => {
    user.followLists = user.followLists.filter((t) => t !== _id)
    return user
  })
  await Promise.all(
    usersWithFollow.map(async (user) => {
      await updateUser(user.uid, {
        followLists: user.followLists,
      })
    })
  )

  // update cache
  await updateSingleCache(Types.user, owner.uid, owner)
  usersWithFollow.map(async (user) => {
    await updateSingleCache(Types.user, user.uid)
  })
  await updateAllCache(Types.user)

  // remove list
  await deleteOne('lists', { _id })
  await clearSingleCache(Types.list, _id)
  await updateAllCache(Types.list)
}
