import { deleteOne, find, findOne, getAll, insert, updateOne } from './db'
import { getLibraries, updateLibrary } from './libraries'
import { updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'

export async function getCollections() {
  const collections = await getAll('collections')
  return collections.map((collection) => {
    collection.img = collection.img || 'puzzled.png'
    return collection
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
    throw Error('Adding collection and no urlId or name specified')
  }

  return await insert('collections', {
    urlId,
    name: name.trim(),
    img: img || 'puzzled.png',
    nsfw: nsfw || false,
    description: description.trim() || '',
    columns: columns || [],
    items: items || [],
  })
}

export async function updateCollection(
  _id,
  { urlId, img, name, nsfw, description, columns, items }
) {
  if (!_id) {
    throw Error('Updating collection and no _id specified')
  }

  let data = {}
  if (urlId) {
    data.urlId = urlId
  }
  if (img) {
    data.img = img
  }
  if (name) {
    data.name = name.trim()
  }
  if (typeof nsfw !== 'undefined') {
    data.nsfw = nsfw
  }
  if (typeof description === 'string') {
    data.description = description.trim()
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
    throw Error('Updating collection libraries and no _id specified')
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
  // remove collection entry from libraries
  const librariesWithCollection = (
    await find('libraries', {
      collections: [_id],
    })
  ).map((library) => {
    library.collections = library.collections.filter((t) => t !== _id)
    return library
  })

  await Promise.all(
    librariesWithCollection.map(async (library) => {
      await updateLibrary(library._id, {
        collections: library.collections,
      })
    })
  )

  // update cache
  const libraries = await getAll('libraries')
  await updateAllCache(Types.library, libraries)
  librariesWithCollection.map(async (library) => {
    await updateSingleCache(Types.library, library)
  })

  return await deleteOne('collections', { _id })
}
