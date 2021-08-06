// docker run --name index-mongo -d -p 27017:27017 mongo

import {MongoClient, ObjectId} from "mongodb"

function getClient() {
    const uri = (
        "DATABASE_URL" in process.env ?
            process.env.DATABASE_URL :
            "mongodb://localhost"
    )
    const client = new MongoClient(uri)
    return client
}

export async function importData(data) {
    for (const [key, value] of Object.entries(data)) {
        await insertMany(key, value)
    }
}

export async function exportData() {
    return {
        columns: await getAll("columns"),
        items: await getAll("items"),
        tables: await getAll("tables"),
        tabs: await getAll("tabs"),
        users: await getAll("users")
    }
}

function cleanId(data) {
    if (Array.isArray(data)) {
        return data.map(d => {
            d._id = d._id.toString()
            if (d.lastModified) {
                d.lastModified = d.lastModified.toString()
            }
            return d
        })
    }
    data._id = data._id.toString()
    return data
}

function polluteId(query) {
    if (query._id) {
        query._id = ObjectId(query._id)
        if (query.lastModified) {
            query.lastModified = new Date(query.lastModified)
        }
    }
    return query
}

function sortByOrder(data) {
    if (Array.isArray(data) && data.length > 0) {
        if (data[0].order) {
            return data.sort((a, b) => (a.order < b.order ? -1 : 1))
        }
    }
    return data
}

export async function getAll(collection) {
    let data = []
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data = sortByOrder(await db.collection(collection).find().toArray())
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function find(collection, query) {
    query = polluteId(query)
    let data = []
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data = sortByOrder(await db.collection(collection).find(query).toArray())
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function findOne(collection, query) {
    query = polluteId(query)
    let data = []
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).findOne(query)
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function getByURL_ID(collection, url_id) {
    return await findOne(collection, {url_id})
}

export async function insert(collection, data) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).insertOne(data)
    } finally {
        await client.close()
    }
}

export async function insertMany(collection, data) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).insertMany(data)
    } finally {
        await client.close()
    }
}

export async function updateOne(collection, query, data) {
    query = polluteId(query)
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).updateOne(query,
            {
                $set: data,
                $currentDate: {lastModified: true}
            }
        )
    } finally {
        await client.close()
    }
}
