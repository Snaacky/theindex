import { ObjectId } from 'mongodb'
import { count, deleteOne, findOne, getAll, insert, updateOne } from './db'
import { deleteList, getLists } from './lists'
import {
  clearSingleCache,
  getSingleCache,
  updateAllCache,
  updateSingleCache,
} from './cache'
import { Types } from '../../types/Components'
import { AccountType, User, UserUpdate } from '../../types/User'

export async function userExists(uid: string): Promise<boolean> {
  // manual query required as getUser does way more
  return (
    (await findOne('users', {
      uid,
    })) !== null
  )
}

export async function gatherUserInfo(user: User | null): Promise<User> {
  if (user === null || typeof user === 'undefined') {
    console.warn(
      'Well... gathering user data of',
      user,
      'is going to be difficult'
    )
    return {
      _id: '',
      accountType: AccountType.user,
      description: '',
      uid: '',
      name: '',
      image: '',
      favs: [],
      lists: [],
      followLists: [],
      createdAt: '',
      views: 0,
    } as User
  }

  const data = (await findOne('nextauth_users', {
    _id: new ObjectId(user.uid),
  })) as User | null
  if (data === null) {
    console.warn('User does not exists in next-auth db yet')
    user.favs = user.favs || []
    user.lists = user.lists || []
    user.followLists = user.followLists || []
    return user
  }

  if (typeof data.name !== 'string') {
    console.warn('User has invalid name', data.name)
  }
  if (typeof data.image !== 'string') {
    console.warn('User has invalid name', data.image)
  }

  user.name = data.name
  user.image = data.image
  user.favs = user.favs || []
  user.lists = user.lists || []
  user.followLists = user.followLists || []
  return user
}

export async function getUsers(): Promise<User[]> {
  const users = (await getAll('users')) as User[]
  return await Promise.all(
    users.map(
      async ({ uid }) => (await getSingleCache(Types.user, uid)) as User
    )
  )
}

export async function getUser(uid: string): Promise<User | null> {
  const user = (await findOne('users', {
    uid,
  })) as User
  if (user === null) {
    return null
  }

  return await gatherUserInfo(user)
}

export async function addUser({
  uid,
  accountType = AccountType.user,
  description = '',
}: {
  uid: string
  accountType?: AccountType
  description?: string
}) {
  if (typeof uid === 'undefined' || uid === null) {
    throw Error('Adding user and no uid specified')
  }

  if (typeof uid !== 'string') {
    uid = (uid as number).toString()
  }
  await insert('users', {
    uid,
    accountType,
    description,
    favs: [],
    lists: [],
    followLists: [],
  })

  await updateSingleCache(Types.user, uid)
  await updateAllCache(Types.user)
}

export async function updateUser(
  uid: string,
  { accountType, description, favs, lists, followLists }: UserUpdate
) {
  if (!uid) {
    throw Error('Updating user and no uid specified')
  }

  let data: Record<string, any> = {}
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
  await updateOne('users', { uid }, data)
  await updateSingleCache(Types.user, uid)
}

export async function deleteUser(uid: string) {
  // delete list with user as owner
  const allLists = await getLists()
  await Promise.all(
    allLists.map(async (list) => {
      if (list.owner === uid) {
        return await deleteList(list._id)
      }
    })
  )

  await deleteOne('users', { uid })
  await clearSingleCache(Types.user, uid)
  await updateAllCache(Types.user)
}

export async function countUsers(): Promise<number> {
  return await count('users')
}
