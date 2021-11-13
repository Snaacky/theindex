import { ObjectId } from 'mongodb'
import {
  count,
  deleteOne,
  find,
  findOne,
  getAll,
  insert,
  updateOne,
} from './db'
import { deleteList, getList, getLists } from './lists'

export async function userExists(uid) {
  if (typeof uid !== 'string') {
    uid = uid.toString()
  }

  // manual query required as getUser does way more
  return (
    (await findOne('users', {
      uid,
    })) !== null
  )
}

async function gatherUserInfo(user) {
  if (user === null || typeof user === 'undefined') {
    console.warn(
      'Well... gathering user data of',
      user,
      'is going to be difficult'
    )
    return {
      name: '',
      image: '',
      favs: [],
      lists: [],
      followLists: [],
    }
  }

  const data = await findOne('nextauth_users', { _id: ObjectId(user.uid) })

  /* TODO: move to on login event
  // if somehow failed to get user data, use discord to get the discord name/image
  const discordUser = await fetch(
      'https://discord.com/api/users/' + data.providerAccountId,
      {
        headers: {
          Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        },
      }
  ).then((r) => r.json())

  user.name = discordUser.username || 'Failed to connect to discord'
  if (data.providerAccountId && discordUser.avatar) {
    user.image =
        'https://cdn.discordapp.com/avatars/' +
        data.providerAccountId +
        '/' +
        discordUser.avatar +
        '.png'
  } else {
    user.image = process.env.NEXT_PUBLIC_DOMAIN + '/img/puzzled.png'
  }*/

  user.name = user.name || data.name
  user.image = user.image || data.image
  user.favs = user.favs || []
  user.lists = user.lists || []
  user.followLists = user.followLists || []
  return user
}

export async function getUsers() {
  const users = (await getAll('users')).map((u) => {
    u.uid = u.uid.toString()
    return u
  })
  return await Promise.all(users.map(async (u) => await gatherUserInfo(u)))
}

export async function getUser(uid) {
  if (typeof uid !== 'string') {
    uid = uid.toString()
  }
  return await gatherUserInfo(
    await findOne('users', {
      uid,
    })
  )
}

export async function addUser({ uid, accountType, description = '' }) {
  if (!uid) {
    throw Error('Adding user and no uid specified')
  }

  if (typeof uid !== 'string') {
    uid = uid.toString()
  }
  return await insert('users', {
    uid,
    accountType: accountType || '',
    description: description || '',
    favs: [],
    lists: [],
    followLists: [],
  })
}

export async function updateUser(
  uid,
  { accountType, description, favs, lists, followLists }
) {
  if (!uid) {
    throw Error('Updating user and no uid specified')
  }

  if (typeof uid !== 'string') {
    uid = uid.toString()
  }

  let data = {}
  if (accountType) {
    data.accountType = accountType
  }
  if (typeof description === 'string') {
    data.description = description.trim()
  }
  if (favs) {
    data.favs = favs
  }
  if (lists) {
    data.lists = lists
  }
  if (followLists) {
    data.followLists = followLists
  }
  return await updateOne('users', { uid }, data)
}

export async function deleteUser(uid) {
  if (typeof uid !== 'string') {
    uid = uid.toString()
  }

  // delete list with user as owner
  const allLists = await getLists()
  await Promise.all(
    allLists.map(async (list) => {
      if (list.owner === uid) {
        return await deleteList(list._id)
      }
    })
  )

  return await deleteOne('users', { uid })
}

export async function countUsers() {
  return await count('users')
}

export async function getUserWithLists(uid) {
  const user = await getUser(uid)
  user.lists = await find('lists', { owner: user.uid })
  user.followLists = await Promise.all(
    (user.followLists || []).map(async (l) => await getList(l))
  )
  return user
}
