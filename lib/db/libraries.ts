import { count, deleteOne, findOne, getAll, insert, updateOne } from './db'
import { clearSingleCache, updateAllCache, updateSingleCache } from './cache'
import { Types } from '../../types/Components'
import {Library, LibraryUpdate, LibraryWithCollection} from '../../types/Library'

export async function getLibraries(): Promise<Library[]> {
  return ((await getAll('libraries')) as Library[]).sort((a, b) =>
    a.order > b.order ? 1 : -1
  )
}

export async function getLibrary(_id: string): Promise<Library | null> {
  return (await findOne('libraries', { _id })) as Library
}

export async function countLibraries(): Promise<number> {
  return await count('libraries')
}

export async function addLibrary(
  urlId: string,
  img: string = 'puzzled.png',
  name: string,
  nsfw: boolean = false,
  description: string = '',
  collections: string[] = []
): Promise<string> {
  if (!urlId || !name) {
    throw Error('Adding library and no urlId or name specified')
  }

  const newId = await insert('libraries', {
    urlId,
    name,
    img: img || 'puzzled.png',
    nsfw: nsfw || false,
    description: (description || '').trim(),
    collections: collections || [],
    order: await countLibraries(),
  })
  await updateSingleCache(Types.library, newId)
  await updateAllCache(Types.library)
  return newId
}

export async function updateLibrary(
  _id: string,
  { urlId, img, name, nsfw, description, collections, order }: LibraryUpdate
) {
  if (!_id) {
    throw Error('Updating library and no _id specified')
  }

  let data: Record<string, any> = {}
  if (typeof urlId === 'string') {
    data.urlId = urlId
  }
  if (typeof img === 'string') {
    data.img = img
  }
  if (typeof name === 'string') {
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
  if (typeof order === 'number' && order >= 0) {
    data.order = order
  }
  await updateOne('libraries', { _id }, data)
  await updateSingleCache(Types.library, _id)
}

export async function getLibrariesWithCollections(): Promise<LibraryWithCollection[]> {
  const libraries = await getLibraries()
  return await Promise.all(
      libraries.map(async (t) => {
        // @ts-ignore
        t.collections = await Promise.all(
            t.collections.map(
                async (collection) =>
                    await findOne('collections', { _id: collection })
            )
        )
        return t as unknown as LibraryWithCollection
      })
  )
}

export async function deleteLibrary(_id: string) {
  await deleteOne('libraries', { _id })
  await clearSingleCache(Types.library, _id)
  await updateAllCache(Types.library)
}
