// docker run --name index-mongo -d -p 27017:27017 mongo

import {MongoClient, ObjectId} from "mongodb"

function getClient() {
    const uri = (
        "DB_CONNECTION_URI" in process.env ?
            process.env.DB_CONNECTION_URI :
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
            return d
        })
    }
    data._id = data._id.toString()
    return data
}

function poluteId(query) {
    if (query._id) {
        query._id = ObjectId(query._id)
    }
    return query
}

export async function getAll(collection) {
    let data = []
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).find().toArray()
    } finally {
        await client.close()
    }
    return cleanId(data)
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

export async function find(collection, query) {
    query = poluteId(query)
    let data = []
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).find(query).toArray()
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function findOne(collection, query) {
    query = poluteId(query)
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

export async function updateOne(collection, query, data) {
    query = poluteId(query)
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
