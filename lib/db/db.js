// docker run --name index-mongo -d -p 27017:27017 mongo

import {MongoClient, ObjectId} from "mongodb"

function getClient() {
    const uri = (
        "DATABASE_URL" in process.env ?
            process.env.DATABASE_URL :
            "mongodb://localhost"
    )
    return new MongoClient(uri)
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
    if (typeof data !== "undefined" && data !== null) {
        if (Array.isArray(data)) {
            return data.map(d => {
                if (d._id) {
                    d._id = d._id.toString()
                }
                if (d.lastModified) {
                    d.lastModified = d.lastModified.toString()
                }
                if (d.createdAt) {
                    d.createdAt = d.createdAt.toString()
                }
                return d
            })
        }
        if (data._id) {
            data._id = data._id.toString()
        }
        if (data.lastModified) {
            data.lastModified = data.lastModified.toString()
        }
        if (data.createdAt) {
            data.createdAt = data.createdAt.toString()
        }
    }
    return data
}

function polluteId(query) {
    if (typeof query !== "undefined") {
        if (query._id) {
            query._id = ObjectId(query._id)
        }
        if (query.lastModified) {
            query.lastModified = new Date(query.lastModified)
        }
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
        if (data.length > 0 && "title" in data[0]) {
            data = data.sort((a, b) => a.name < b.name ? -1 : 1)
        }
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
        data = await db.collection(collection).find(query).toArray()
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

export async function count(collection, query) {
    query = polluteId(query)
    const client = getClient()
    let data
    try {
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).countDocuments(query)
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function getByUrlId(collection, urlId) {
    return await findOne(collection, {urlId})
}

export async function insert(collection, data) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        data.createdAt = new Date()
        data.lastModified = new Date()
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
        data.forEach(d => {
            d.lastModified = new Date()
            d.createdAt = d.lastModified
        })
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

export async function deleteOne(collection, query) {
    query = polluteId(query)
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).deleteOne(query)
    } finally {
        await client.close()
    }
}
