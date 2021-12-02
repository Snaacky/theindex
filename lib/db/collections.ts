import { deleteOne, find, findOne, getAll, insert, updateOne } from './db'
import { getLibraries, updateLibrary } from './libraries'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'
import { Collection, CollectionUpdate } from '../../types/Collection'
import { Library } from '../../types/Library'

export async function getCollections(): Promise<Collection[]> {
  const collections = (await getAll('collections')) as Collection[]
  return collections.map((collection) => {
    collection.img = collection.img || 'puzzled.png'
    return collection
  })
}

export async function getCollection(_id: string): Promise<Collection | null> {
  const c = (await findOne('collections', { _id })) as Collection
  if (c !== null) {
    c.img = c.img || 'puzzled.png'
  }
  return c
}

export async function addCollection(
  urlId: string,
  img = 'puzzled.png',
  name: string,
  nsfw = false,
  description = '',
  columns: string[] = [],
  items: string[] = []
): Promise<string> {
  if (!urlId || !name) {
    throw Error('Adding collection and no urlId or name specified')
  }

  const newId = await insert('collections', {
    urlId,
    name: name.trim(),
    img: img || 'puzzled.png',
    nsfw: nsfw || false,
    description: (description || '').trim(),
    columns: columns || [],
    items: items || [],
  })

  await updateSingleCache(Types.collection, newId)
  await updateAllCache(Types.collection)
  return newId
}

export async function updateCollection(
  _id: string,
  { urlId, img, name, nsfw, description, columns, items }: CollectionUpdate
) {
  if (!_id) {
    throw Error('Updating collection and no _id specified')
  }

  let data: Record<string, any> = {}
  if (typeof urlId === 'string') {
    data.urlId = urlId
  }
  if (typeof img === 'string') {
    data.img = img
  }
  if (typeof name === 'string') {
    data.name = name.trim()
  }
  if (typeof nsfw === 'boolean') {
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
  await updateOne('collections', { _id }, data)

  await updateSingleCache(Types.collection, _id)
}

export async function updateCollectionLibraries(
  _id: string,
  tLibraries: string[]
) {
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

export async function deleteCollection(_id: string) {
  // remove collection entry from libraries
  const librariesWithCollection = (
    (await find('libraries', {
      collections: [_id],
    })) as Library[]
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
    await updateSingleCache(Types.library, library._id)
  })

  // remove collection
  await deleteOne('collections', { _id })
  await clearSingleCache(Types.collection, _id)
  await updateAllCache(Types.collection)
}
