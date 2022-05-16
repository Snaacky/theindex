import dotenv from 'dotenv'
import fs from 'fs'
import Mongo from 'mongodb'
import Redis from 'ioredis'
import { iso6393 } from 'iso-639-3'

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
  warnEnv('NEXT_PUBLIC_DOMAIN', 'https://theindex.moe')
}

if (!('NEXTAUTH_URL' in process.env)) {
  warnEnv('NEXTAUTH_URL', 'https://theindex.moe')
}

if (!('DATABASE_URL' in process.env)) {
  warnEnv('DATABASE_URL', 'mongodb://mongo:27017/index')
}
let dbClient, db
try {
  dbClient = new MongoClient(
    'DATABASE_URL' in process.env
      ? process.env.DATABASE_URL
      : 'mongodb://mongo:27017/index',
    { maxPoolSize: 5 }
  )
  await dbClient.connect()
  db = dbClient.db()
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
if ('AUDIT_WEBHOOK' in process.env) {
  console.log(
    "ENV 'AUDIT_WEBHOOK' provided, on item edits, a post will be send to webhook:",
    process.env.AUDIT_WEBHOOK
  )
} else {
  console.warn(
    "ENV 'AUDIT_WEBHOOK' is not provided, no webhook posts will be made"
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

let dbCollections = await db.listCollections({}, { nameOnly: true }).toArray()
dbCollections = dbCollections.map((c) => c.name)

if (!dbCollections.includes('columns')) {
  process.exit(0)
}
const columns = await db.collection('columns').find().toArray()
await Promise.all(
  columns.map(async (column) => {
    if (column.type === 'bool' || column.type === 'boolean') {
      console.log('column', column._id.toString())
      await update('columns', { _id: column._id }, { type: 'feature' })
    }
  })
)
console.log('Cleaned up columns\n')

if (!dbCollections.includes('items')) {
  process.exit(0)
}
let items = await db.collection('items').find().toArray()
const livingLang = iso6393.filter((lang) => lang.type === 'living')
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
      } else if (column.type === 'language') {
        item.data[column._id.toString()] = item.data[column._id.toString()].map(
          (l) => {
            if (l !== l.toLowerCase()) {
              l = l.toLowerCase()
              updateData = true
            }
            if (l.length === 2) {
              const newL = livingLang.find((lang) => lang.iso6391 === l)
              if (newL) {
                l = newL.iso6393
                updateData = true
              }
            }
            return l
          }
        )
      }
    }

    if (updateData) {
      await update('items', { _id: item._id }, { data: item.data })
      console.log('Deleted data of non existing column from item', item._id)
    }
  })
)
console.log('Cleaned up items\n')

if (!dbCollections.includes('users')) {
  process.exit(0)
}
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
      await remove('users', { _id: multipleUsers[i]._id })
      users = users.filter((u) => u._id !== multipleUsers[i]._id)

      console.log(
        'Removed duplicate user',
        multipleUsers[i]._id,
        'of duplicate user entry of uid',
        user.uid
      )
    }

    await update('users', { _id: multipleUsers[0]._id }, { data })
  }
}
console.log('Cleaned up users\n')
console.log('Cleanup finished\n')

await dbClient.close()
console.log('Mongo db connection closed\n')

process.exit(0)
