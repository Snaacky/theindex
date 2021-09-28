import { deleteOne, findOne, getAll, insert, updateOne } from './db'
import { getLibraries, updateLibrary } from './libraries'

export async function getCollections() {
  const c = await getAll('collections')
  return c.map((c) => {
    c.img = c.img || 'puzzled.png'
    return c
  })
}

export async function getCollection(_id) {
  const c = await findOne('collections', { _id })
  c.img = c.img || 'puzzled.png'
  return c
}

export async function addCollection(
  urlId,
  img,
  name,
  nsfw,
  description,
  columns,
  items
) {
  if (!urlId || !name) {
    throw 'Adding collection and no urlId or name specified'
  }

  return await insert('collections', {
    urlId,
    name,
    img: img || 'puzzled.png',
    nsfw: nsfw || false,
    description: description || '',
    columns: columns || [],
    items: items || [],
  })
}

export async function updateCollection(
  _id,
  { urlId, img, name, nsfw, description, columns, items }
) {
  if (!_id) {
    throw 'Updating collection and no _id specified'
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
  if (description) {
    data.description = description
  }
  if (columns) {
    data.columns = columns
  }
  if (items) {
    data.items = items
  }
  return await updateOne('collections', { _id }, data)
}

export async function updateCollectionLibraries(_id, tLibraries) {
  if (!_id) {
    throw 'Updating collection libraries and no _id specified'
  }

  const allLibraries = await getLibraries()
  return await Promise.all(
    allLibraries.map(async (library) => {
      if (library.collections.includes(_id)) {
        if (!tLibraries.includes(library._id)) {
          return await updateLibrary(library._id, {
            collections: library.collections.filter((c) => c !== _id),
          })
        }
      } else if (tLibraries.includes(library._id)) {
        return await updateLibrary(library._id, {
          collections: library.collections.concat([_id]),
        })
      }
    })
  )
}

export async function deleteCollection(_id) {
  // remove collection from all user libraries
  const allLibraries = await getLibraries()
  await Promise.all(
    allLibraries.map(async (library) => {
      if (library.collections.includes(_id)) {
        return await updateLibrary(library._id, {
          collections: library.collections.filter((c) => c !== _id),
        })
      }
    })
  )

  return await deleteOne('collections', { _id })
}
