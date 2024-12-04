import { dbClient } from './db'
import { GridFSBucket } from 'mongodb'
import { Readable } from 'stream'

export function bufferToStream(buffer: Buffer) {
  let stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

// note you want usually want to not use this function as you loose all the benefits of streams
export function streamToBuffer(stream: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer: any[] = []
    stream.on('data', (chunk) => buffer.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(buffer)))
    stream.on('error', (err) => reject(err))
  })
}

export function imgToStream(img: Uint8Array) {
  let stream = new Readable()
  stream.push(img)
  stream.push(null)
  return stream
}

export async function addItemScreenshot(img: Uint8Array, itemId: string) {
  // convert uint8array image to stream
  const imgStream = new Readable()
  imgStream.push(img)
  imgStream.push(null)

  const db = (await dbClient).db('index')
  const bucket = new GridFSBucket(db, {
    bucketName: 'itemScreenshots',
  })

  // remove outdated screenshots
  const oldImages = await bucket.find({ filename: itemId }).toArray()
  if (oldImages.length > 0) {
    console.info(
      'Screenshot for',
      itemId,
      'has old images... deleting',
      oldImages.length
    )
    await Promise.all(oldImages.map((doc) => bucket.delete(doc._id)))
  }

  // upload new screenshot
  const stream = bucket.openUploadStream(itemId)
  imgStream.pipe(stream)
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    imgStream.on('error', reject)
  })
}

export async function getItemScreenshotBuffer(itemId: string) {
  const db = (await dbClient).db('index')
  const bucket = new GridFSBucket(db, {
    bucketName: 'itemScreenshots',
  })

  const stream = bucket.openDownloadStreamByName(itemId)
  return await streamToBuffer(stream)
}

export async function screenshotExists(itemId: string) {
  const db = (await dbClient).db('index')
  const bucket = new GridFSBucket(db, {
    bucketName: 'itemScreenshots',
  })
  const cursor = await bucket.find({ filename: itemId })
  return await cursor.hasNext()
}

export async function clearAllScreenshots() {
  const db = (await dbClient).db('index')
  const bucket = new GridFSBucket(db, {
    bucketName: 'itemScreenshots',
  })
  return await bucket.drop()
}

export async function listScreenshotsOfItem(itemId: string) {
  const db = (await dbClient).db('index')
  const bucket = new GridFSBucket(db, {
    bucketName: 'itemScreenshots',
  })
  return bucket.find({ filename: itemId })
}
