// docker run --name index-mongo -d -p 27017:27017 mongo
import {MongoClient, ObjectId} from "mongodb"

export function getClient() {
    const uri = (
        "DATABASE_URL" in process.env ?
            process.env.DATABASE_URL :
            "mongodb://localhost"
    )
    return new MongoClient(uri, {maxPoolSize: 5, useUnifiedTopology: true})
}

export async function importData(data) {
    for (const [key, value] of Object.entries(data)) {
        await insertMany(key, value)
    }
}

export async function exportData() {
    return {
        collections: await getAll("collections"),
        columns: await getAll("columns"),
        items: await getAll("items"),
        libraries: await getAll("libraries"),
        lists: await getAll("lists"),
        users: await getAll("users")
    }
}

export function cleanId(data) {
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

export function polluteId(query) {
    if (typeof query !== "undefined") {
        if (query._id && typeof query._id === "string") {
            query._id = ObjectId(query._id)
        }
        if (query.lastModified && typeof query.lastModified === "string") {
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
        if (data.length > 0 && "name" in data[0]) {
            data = data.sort((a, b) => a.name < b.name ? -1 : 1)
        }
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function find(collection, query) {
    let data = []
    const client = getClient()
    try {
        query = polluteId(query)
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).find(query).toArray()
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function findOne(collection, query) {
    let data = []
    const client = getClient()
    try {
        query = polluteId(query)
        await client.connect()
        const db = client.db("index")
        data = await db.collection(collection).findOne(query)
    } finally {
        await client.close()
    }
    return cleanId(data)
}

export async function count(collection, query) {
    const client = getClient()
    let data
    try {
        query = polluteId(query)
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
        const {insertedId} = await db.collection(collection).insertOne(data)
        return insertedId.toString()
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
    const client = getClient()
    try {
        query = polluteId(query)
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
    const client = getClient()
    try {
        query = polluteId(query)
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).deleteOne(query)
    } finally {
        await client.close()
    }
}

export function singularToPlural(type) {
    if (type === "item") {
        return "items"
    } else if (type === "column") {
        return "columns"
    } else if (type === "collection") {
        return "collections"
    } else if (type === "library") {
        return "libraries"
    } else if (type === "user") {
        return "users"
    } else if (type === "list") {
        return "lists"
    } else {
        throw "Unknown type"
    }
}
