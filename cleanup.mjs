import dotenv from 'dotenv'
import fs from 'fs'
import Mongo from 'mongodb'
import Redis from 'ioredis'

const {MongoClient, ObjectId} = Mongo

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
        {maxPoolSize: 5, useUnifiedTopology: true}
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

const updateColumn = async (query, data) => {
    await db.collection('columns').updateOne(polluteId(query), {
        $set: data,
        $currentDate: {lastModified: true},
    })
}

const fixColumn = async (column) => {
    if (column.type === 'bool') {
        await updateColumn({_id: column._id}, {type: 'boolean'})
    }
}
const columns = await db.collection('columns').find().toArray()
await Promise.all(columns.map(column => fixColumn(column)))

dbClient.close()
console.log('Mongo db connection closed')
process.exit(0)
