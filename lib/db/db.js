// docker run --name index-mongo -d -p 27017:27017 mongo

import {MongoClient} from "mongodb"

function getClient() {
    const uri = (
        "DB_CONNECTION_URI" in process.env ?
            process.env.DB_CONNECTION_URI :
            "mongodb://localhost"
    )
    const client = new MongoClient(uri)
    return client
}

function cleanId(data) {
    return data.map(d => {
        d._id = d._id.toString()
        return d
    })
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

export async function addEntry(collection, data) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).insertOne(data)
    } finally {
        await client.close()
    }
}

export async function find(collection, query) {
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

export async function updateOne(collection, filter, data) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        await db.collection(collection).updateOne(filter,
            {
                $set: data,
                $currentDate: {lastModified: true}
            }
        )
    } finally {
        await client.close()
    }
}
