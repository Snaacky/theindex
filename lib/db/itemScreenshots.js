import {getClient} from "./db"
import {GridFSBucket, ObjectId} from "mongodb"
import fs from "fs"


export async function addItemScreenshot(screenshotPath, itemId, timestampOfCapture) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        const bucket = new GridFSBucket(db, {
            bucketName: "itemScreenshots"
        })
        fs.createReadStream(screenshotPath)
            .pipe(bucket.openUploadStream(itemId + "_" + timestampOfCapture, {
                metadata: {
                    field: "item",
                    value: itemId
                }
            }))
    } finally {
        await client.close()
    }
}

export async function getItemScreenshotStream(screenshotId) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        const bucket = new GridFSBucket(db, {
            bucketName: "itemScreenshots"
        })
        return bucket.openDownloadStream(ObjectId(screenshotId))
    } finally {
        await client.close()
    }
}

export async function listScreenshotsOfItem(itemId) {
    const client = getClient()
    try {
        await client.connect()
        const db = client.db("index")
        const bucket = new GridFSBucket(db, {
            bucketName: "itemScreenshots"
        })
        return bucket.find({item: itemId})
    } finally {
        await client.close()
    }
}
