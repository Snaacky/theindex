import { count, deleteOne, findOne, getAll, insert, updateOne } from './db'

export async function getLibraries() {
  return (await getAll('libraries')).sort((a, b) =>
    a.order > b.order ? 1 : -1
  )
}

export async function getLibrary(_id) {
  return await findOne('libraries', { _id })
}

export async function countLibraries() {
  return await count('libraries')
}

export async function addLibrary(
  urlId,
  img,
  name,
  nsfw,
  description,
  collections
) {
  if (!urlId || !name) {
    throw Error('Adding library and no urlId or name specified')
  }

  return insert('libraries', {
    urlId,
    name,
    img: img || 'puzzled.png',
    nsfw: nsfw || false,
    description: description || '',
    collections: collections || [],
    order: await countLibraries(),
  })
}

export async function updateLibrary(
  _id,
  { urlId, img, name, nsfw, description, collections, order }
) {
  if (!_id) {
    throw Error('Updating library and no _id specified')
  }

  let data = {}
  if (urlId) {
    data.urlId = urlId
  }
  if (img) {
    data.img = img
  }
  if (name) {
    data.name = name
  }
  if (typeof nsfw !== 'undefined') {
    data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    data.description = description
  }
  if (collections) {
    data.collections = collections
  }
  if (typeof order !== 'undefined') {
    data.order = order
  }
  return await updateOne('libraries', { _id }, data)
}

export async function getLibrariesWithCollections() {
  const libraries = await getLibraries()
  return await Promise.all(
    libraries.map(async (t) => {
      t.collections = await Promise.all(
        t.collections.map(
          async (collection) =>
            await findOne('collections', { _id: collection })
        )
      )
      return t
    })
  )
}

export async function deleteLibrary(_id) {
  return await deleteOne('libraries', { _id })
}
