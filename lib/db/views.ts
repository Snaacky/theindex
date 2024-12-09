import { count, deleteOne, find, findOne, getAll, insert } from './db'
import { cleanId } from './utils'
import { Types } from '../../types/Components'
import { findOneTyped } from './dbTyped'
import clientPromise from './mongoDB'

export async function getViews() {
  return await getAll('views')
}

export async function getLastViews(type: Types, n: number) {
  const db = (await clientPromise).db('index')
  const data = cleanId(
    await db
      .collection('views')
      .find({ type })
      .sort({ createdAt: -1 })
      .limit(n)
      .toArray()
  )
  console.log('Found', data.length, 'entries in views table for', type)

  // count what has been popular recently
  let accumulated = {}

  data.forEach((d) => {
    if (accumulated[d._id]) {
      accumulated[d._id] += 1
    } else {
      accumulated[d._id] = 1
    }
  })

  // sort them by popularity
  let sorted = Object.keys(accumulated)
    .map((id) => {
      return { contentId: id, count: accumulated[id] }
    })
    .sort((a, b) => (a.count > b.count ? -1 : 1))

  // resolve content info
  return (
    await Promise.all(
      sorted.map(async (s) => {
        const data = await findOneTyped(type, s.contentId)
        if (data !== null) {
          data.views = s.count
        }
        return data
      })
    )
  ).filter((s) => s !== null && typeof s !== 'undefined')
}

export async function getView(_id) {
  return await findOne('views', { _id })
}

export async function getViewByUser(uid) {
  return await find('views', { uid })
}

export async function addView({ uid, type, contentId }) {
  if (!uid || !type || !contentId) {
    throw Error('Adding stat and no uid, type or content specified')
  }

  if (typeof uid !== 'string') {
    uid = uid.toString()
  }
  return await insert('views', {
    uid,
    type,
    contentId,
  })
}

export async function deleteView(_id: string) {
  return await deleteOne('views', { _id })
}

export async function countViews() {
  return await count('views')
}

export async function countViewsOfContent(type: Types, _id: string) {
  return await count('views', { type, _id })
}
