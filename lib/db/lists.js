import { deleteOne, find, findOne, getAll, insert, updateOne } from './db'
import { randIcon } from '../icon'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'
import { getUser, updateUser } from './users'

export async function getLists() {
  const lists = await getAll('lists')
  lists.forEach((t) => (t.img = randIcon()))
  return lists
}

export async function getList(_id) {
  return await findOne('lists', { _id })
}

export async function addList(owner, name, nsfw, description, columns, items) {
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
  _id,
  { owner, name, nsfw, description, columns, items }
) {
  if (!_id) {
    throw Error('Updating list and no _id specified')
  }

  let data = {}
  if (owner) {
    data.owner = owner
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
  if (columns) {
    data.columns = columns
  }
  if (items) {
    data.items = items
  }
  await updateOne('lists', { _id }, data)
  await updateSingleCache(Types.list, _id)
}

export async function deleteList(_id) {
  // remove list entry from owner
  const list = await getList(_id)
  const owner = await getUser(list.owner)
  owner.lists = owner.lists.filter((userList) => userList !== _id)

  await updateUser(owner.uid, {
    lists: owner.lists,
  })

  // remove list entry from user follows
  const usersWithFollow = (
    await find('users', {
      followLists: [_id],
    })
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
  const users = await getAll('users')
  await updateAllCache(Types.user, users)
  await updateSingleCache(Types.user, owner.uid, owner)
  usersWithFollow.map(async (user) => {
    await updateSingleCache(Types.user, user)
  })

  // remove list
  await deleteOne('lists', { _id })
  await clearSingleCache(Types.list, _id)
  await updateAllCache(Types.list)
}
