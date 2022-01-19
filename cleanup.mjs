import dotenv from 'dotenv'
import fs from 'fs'
import Mongo from 'mongodb'
import Redis from 'ioredis'
import ISO6391 from 'iso-639-1'

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
    if (column.type === 'bool' || column.type === 'boolean') {
      console.log('column', column._id.toString())
      await update('columns', { _id: column._id }, { type: 'feature' })
    }
  })
)
console.log('Cleaned up columns\n')

let items = await db.collection('items').find().toArray()
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

if (('DO_MIGRATE' in process.env) && process.env.DO_MIGRATE === 'TRUE') {
  console.log('\nStarting migration script')

  console.log(
    'All columns are:',
    columns.map((column) => column.name)
  )

  const renameColumn = async (column, newName) => {
    if (column) {
      await db.collection('columns').updateOne(
        {
          _id: column._id,
        },
        {
          $set: {
            name: newName,
          },
          $currentDate: { lastModified: true },
        }
      )
    }
  }

  const migrateToProCon = async (column, values) => {
    if (typeof column === 'undefined' || column === null) {
      return
    }

    console.log('Migrating column', column.name, 'to type Pro/Con')
    if (column.type === 'proAndCon') {
      console.log('Already proAndCon, nothing to do')
      return
    }

    if (column.type !== 'feature') {
      console.error(
        'Cannot migrate column',
        column.name,
        'to type Pro/Con as type is',
        column.type
      )
      process.exit(1)
    }

    if (values.length !== 2) {
      console.error(
        'Cannot migrate column',
        column.name,
        'as values is',
        values
      )
      process.exit(1)
    }

    await db.collection('columns').updateOne(
      {
        _id: column._id,
      },
      {
        $set: {
          type: 'proAndCon',
          values: values,
        },
        $currentDate: { lastModified: true },
      }
    )
  }

  await migrateToProCon(
    columns.find((column) => column.name === 'Ads'),
    ['No Ads', 'Ads']
  )
  await migrateToProCon(
    columns.find((column) => column.name === 'Anti-Adblock'),
    ['No Anti-Adblock', 'Anti-Adblock']
  )
  await migrateToProCon(
    columns.find((column) => column.name === 'Watermark'),
    ['No Watermark', 'Watermark']
  )

  const convertToArray = async (column, values) => {
    if (typeof column === 'undefined' || column === null) {
      return
    }

    console.log(
      'Converting column',
      column.name,
      'to type array with values',
      values
    )
    if (column.type === 'array') {
      console.log('Already array, nothing to do')
      return
    }

    await db.collection('columns').updateOne(
      {
        _id: column._id,
      },
      {
        $set: {
          type: 'array',
          values: values,
        },
        $currentDate: { lastModified: true },
      }
    )
  }

  const migrateToLanguage = async (column, items) => {
    if (typeof column === 'undefined' || column === null) {
      return
    }

    console.log('Migrating column', column.name, 'to type Language')
    if (column.type === 'language') {
      console.log('Already lanugage, nothing to do')
      return
    }

    if (column.type !== 'feature' || column.type !== 'array') {
      console.error(
        'Cannot migrate column',
        column.name,
        'to type Language as type is',
        column.type
      )
      process.exit(1)
    }

    await db.collection('columns').updateOne(
      {
        _id: column._id,
      },
      {
        $set: {
          type: 'language',
          values: [],
        },
        $currentDate: { lastModified: true },
      }
    )
    const affectedItems = items.filter((item) =>
      Object.keys(item.data).includes(column._id.toString())
    )
    console.log(affectedItems.length, 'items are affected')
    await Promise.all(
      affectedItems.map(async (item) => {
        let data = item.data
        console.log('Converting data', data, 'of item', item._id)

        if (Array.isArray(data[column._id.toString()])) {
          const codes = ISO6391.getAllCodes()
          data[column._id.toString()] = data[column._id.toString()].filter(
            (d) => codes.includes(d.toLowerCase())
          )
        } else if (typeof data[column._id.toString()] === 'boolean') {
          data[column._id.toString()] = []
        }
        await db.collection('items').updateOne(
          {
            _id: item._id,
          },
          {
            $set: {
              data: data,
            },
            $currentDate: { lastModified: true },
          }
        )
      })
    )
  }

  items = await db.collection('items').find().toArray()
  let languageColumn = columns.find((column) => column.name === 'Languages')
  await migrateToLanguage(languageColumn, items)
  await renameColumn(languageColumn, 'Site')

  items = await db.collection('items').find().toArray()
  let subColumn = columns.find((column) => column.name === 'Subs')
  await migrateToLanguage(subColumn, items)
  await renameColumn(subColumn, 'Sub')

  items = await db.collection('items').find().toArray()
  let dubColumn = columns.find((column) => column.name === 'Dubs')
  await migrateToLanguage(dubColumn, items)
  await renameColumn(dubColumn, 'Dub')

  items = await db.collection('items').find().toArray()
  let p360 = columns.find((column) => column.name === '360p')
  let p480 = columns.find((column) => column.name === '480p')
  let p720 = columns.find((column) => column.name === '720p')
  let p1080 = columns.find((column) => column.name === '1080p')

  const resolutions = [p360, p480, p720, p1080].filter(
    (res) => typeof res !== 'undefined' && res !== null
  )

  let video = columns.find((column) => column.name === 'Video')

  if (
    resolutions.length > 0 &&
    !resolutions.some((res) => res.type !== 'feature')
  ) {
    const affectedItems = items.filter((item) =>
      resolutions
        .map((res) => res._id.toString())
        .some((res) => Object.keys(item.data).includes(res))
    )
    console.log(
      'Affected items are: ',
      affectedItems.map((item) => item.name)
    )

    if (typeof video === 'undefined' || video === null) {
      await renameColumn(resolutions[0], 'Video')
      video = resolutions[0]
    }
    if (video.type !== 'array') {
      await convertToArray(video, ['360p', '480p', '720p', '1080p'])
    }

    await Promise.all(
      affectedItems.map(async (item) => {
        let values = []
        let data = item.data

        if (p360 && Object.keys(item.data).includes(p360._id.toString())) {
          values.push('360p')
          delete data[p360._id.toString()]
        }
        if (p480 && Object.keys(item.data).includes(p480._id.toString())) {
          values.push('480p')
          delete data[p480._id.toString()]
        }
        if (p720 && Object.keys(item.data).includes(p720._id.toString())) {
          values.push('720p')
          delete data[p720._id.toString()]
        }
        if (p1080 && Object.keys(item.data).includes(p1080._id.toString())) {
          values.push('1080p')
          delete data[p1080._id.toString()]
        }

        data[video._id.toString()] = values
        await db.collection('items').updateOne(
          {
            _id: item._id,
          },
          {
            $set: {
              data: data,
            },
            $currentDate: { lastModified: true },
          }
        )
      })
    )
  }
}
/*
Features: (all feature columns would get grouped here together automatically)
DL
Batch DL
Comments
Disqus
MAL-Sync
Mobile Responsive
Schedule
Shared Playback (w2g feature)

Arrays:
Video: 1080p, 360p, 480p, 720p

Language:
Site Language
Dub
Sub
Text (for manga?)

Pro/Cons:
Ads/No Ads
Anti-Adblock/No Anti-Adblock
Watermark/No Watermark
*/

dbClient.close()
console.log('\nMongo db connection closed')

process.exit(0)
