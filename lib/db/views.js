import {
  cleanId,
  count,
  deleteOne,
  find,
  findOne,
  getAll,
  getClient,
  insert,
  singularToPlural,
} from './db'

export async function getViews() {
  return await getAll('views')
}

export async function getLastViews(type, n) {
  let data = []
  const client = getClient()
  try {
    await client.connect()
    const db = client.db('index')
    data = await db
      .collection('views')
      .find({ type })
      .sort({ createdAt: -1 })
      .limit(n)
      .toArray()
  } finally {
    await client.close()
  }
  data = cleanId(data)

  // count what has been popular recently
  let accumulated = {}
  data.forEach((d) => {
    if (accumulated[d.contentId]) {
      accumulated[d.contentId] += 1
    } else {
      accumulated[d.contentId] = 1
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
      sorted.map(
        async (s) =>
          await findOne(
            singularToPlural(type),
            type === 'user' ? { uid: s.contentId } : { _id: s.contentId }
          )
      )
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
    throw 'Adding stat and no uid, type or content specified'
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

export async function deleteView(_id) {
  return await deleteOne('views', { _id })
}

export async function countViews() {
  return await count('views')
}

export async function countViewsOfContent(type, contentId) {
  return await count('users', { type, contentId })
}
