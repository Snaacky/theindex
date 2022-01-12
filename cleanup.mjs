import dotenv from 'dotenv'
import fs from 'fs'
import Mongo from 'mongodb'
import Redis from 'ioredis'

console.log('\nStarting cleanup process\n')

const { MongoClient, ObjectId } = Mongo

// load .env if exists
if (fs.existsSync('./.env')) {
  dotenv.config()
}

const errorEnv = (env) => {
  console.error("Missing required ENV '" + env + "'. Make sure you add it!!!")
  process.exit(1)
}

const warnEnv = (env, defaultValue) => {
  console.error(
    "ENV '" + env + "' is not provided, using default:",
    defaultValue
  )
  process.exit(1)
}

if (!('NEXT_PUBLIC_SITE_NAME' in process.env)) {
  warnEnv('NEXT_PUBLIC_SITE_NAME', 'The Anime Index')
}

if (!('NEXT_PUBLIC_DOMAIN' in process.env)) {
  warnEnv('NEXT_PUBLIC_DOMAIN', 'https://piracy.moe')
}

if (!('NEXTAUTH_URL' in process.env)) {
  warnEnv('NEXTAUTH_URL', 'https://piracy.moe')
}

if (!('DATABASE_URL' in process.env)) {
  warnEnv('DATABASE_URL', 'mongodb://localhost')
}
let dbClient, db
try {
  dbClient = new MongoClient(
    'DATABASE_URL' in process.env
      ? process.env.DATABASE_URL
      : 'mongodb://localhost',
    { maxPoolSize: 5, useUnifiedTopology: true }
  )
  await dbClient.connect()
  db = dbClient.db('index')
  console.log('Connection to mongo db server could be established')
} catch (e) {
  console.error('Failed to connect to mongo db server:', e)
  process.exit(1)
}

if (!('CACHE_URL' in process.env)) {
  warnEnv('CACHE_URL', 'redis://redis:6379')
}
let cacheClient
try {
  cacheClient = new Redis(
    'CACHE_URL' in process.env ? process.env.CACHE_URL : 'redis://localhost'
  )
  cacheClient.flushall().catch((e) => console.error('Failed to flush cache', e))
} catch (e) {
  console.error('Failed to connect to redis cache server:', e)
  process.exit(1)
}

if (!('CHROME_URL' in process.env)) {
  warnEnv('CHROME_URL', 'ws://chrome:3300')
}

if (!('DISCORD_CLIENT_ID' in process.env)) {
  errorEnv('DISCORD_CLIENT_ID')
}

if (!('DISCORD_CLIENT_SECRET' in process.env)) {
  errorEnv('DISCORD_CLIENT_SECRET')
}

// not used atm
if (!('DISCORD_BOT_TOKEN' in process.env)) {
  // errorEnv('DISCORD_BOT_TOKEN')
}

if ('SETUP_WHITELIST_DISCORD_ID' in process.env) {
  console.log(
    "ENV 'SETUP_WHITELIST_DISCORD_ID' provided, on login of",
    process.env.SETUP_WHITELIST_DISCORD_ID,
    'the person will be elevated to admin rights if not already admin'
  )
} else {
  console.warn(
    "ENV 'SETUP_WHITELIST_DISCORD_ID' is not provided, no admin account will be created on any login"
  )
}

const polluteId = (query) => {
  if (typeof query !== 'undefined') {
    if (query.hasOwnProperty('_id') && typeof query._id === 'string') {
      query._id = ObjectId(query._id)
    }
    if (
      query.hasOwnProperty('lastModified') &&
      typeof query.lastModified === 'string'
    ) {
      query.lastModified = new Date(query.lastModified)
    }
  }
  return query
}

const update = async (collection, query, data) => {
  await db.collection(collection).updateOne(polluteId(query), {
    $set: data,
    $currentDate: { lastModified: true },
  })
}

const remove = async (collection, query) => {
  await db.collection(collection).deleteOne(polluteId(query))
}

const columns = await db.collection('columns').find().toArray()
await Promise.all(
  columns.map(async (column) => {
    if (column.type === 'bool') {
      console.log('column', column._id.toString())
      await update('columns', { _id: column._id }, { type: 'boolean' })
    }
  })
)
console.log('Cleaned up columns\n')

const items = await db.collection('items').find().toArray()
await Promise.all(
  items.map(async (item) => {
    const columnKeys = Object.keys(item.data)
    let updateData = false
    for (const columnId of columnKeys) {
      const column = columns.find(
        (column) => column._id.toString() === columnId
      )
      if (!column) {
        delete item.data[columnId]
        updateData = true
      }
    }

    if (updateData) {
      await update('items', { _id: item._id }, { data: item.data })
      console.log('Deleted data of non existing column from item', item._id)
    }
  })
)
console.log('Cleaned up items\n')

let users = await db.collection('users').find().toArray()
for (let i = 0; i < users.length; i++) {
  const user = users[i]
  const userData = await db.collection('nextauth_users').findOne({
    _id: ObjectId(user.uid),
  })

  if (!userData) {
    console.warn('User', user.uid, "is not registered in next-auth's user db")
  }

  let multipleUsers = users.filter((u) => u.uid === user.uid)
  if (multipleUsers.length > 1) {
    console.warn(
      multipleUsers.length,
      'user account entries found for the same user',
      user.uid,
      userData.name
    )
    let data = {
      accountType: 'user',
      description: '',
      favs: [],
      lists: [],
      followLists: [],
      createdAt: new Date(),
    }

    for (const user of multipleUsers) {
      if (user.accountType === 'admin') {
        data.accountType = 'admin'
      } else if (
        user.accountType === 'editor' &&
        data.accountType !== 'admin'
      ) {
        data.accountType = 'editor'
      }

      if (
        user.description !== '' &&
        user.description.length > data.description.length
      ) {
        data.description = user.description
      }

      for (const fav of user.favs) {
        if (!data.favs.includes(fav)) {
          data.favs.push(fav)
        }
      }

      for (const list of user.lists) {
        if (!data.lists.includes(list)) {
          data.lists.push(list)
        }
      }

      for (const list of user.followLists) {
        if (!data.followLists.includes(list)) {
          data.followLists.push(list)
        }
      }

      if (user.createdAt.getTime() < data.createdAt.getTime()) {
        data.createdAt = user.createdAt
      }
    }
    for (let i = 1; i < multipleUsers.length; i++) {
      await remove('users', {_id: multipleUsers[i]._id})
      users = users.filter((u) => u._id !== multipleUsers[i]._id)

      console.log(
        'Removed duplicate user',
        multipleUsers[i]._id,
        'of duplicate user entry of uid',
        user.uid
      )
    }

    await update('users', {_id: multipleUsers[0]._id}, { data })
  }
}
console.log('Cleaned up users\n')

dbClient.close()
console.log('Mongo db connection closed')
console.log('Cleanup finished\n')
process.exit(0)
