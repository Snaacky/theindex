import type { NextApiResponse } from 'next'
import type { Item } from '../types/Item'
import {
  getCollectionsByIds,
  getColumnsForItems,
  getLibrariesForCollection,
} from './db/publicData'

type RevalidateableResponse = NextApiResponse & {
  revalidate?: (urlPath: string) => Promise<void>
}

function addPath(paths: Set<string>, path: string) {
  if (typeof path === 'string' && path !== '') {
    paths.add(path)
  }
}

export async function getItemRelatedPaths(
  item: Item | null,
  collectionIds: string[] = []
) {
  const paths = new Set<string>([
    '/',
    '/items',
    '/collections',
    '/libraries',
    '/columns',
  ])

  if (item !== null) {
    addPath(paths, '/item/' + item._id)

    const columns = await getColumnsForItems([item])
    columns.forEach((column) => addPath(paths, '/column/' + column.urlId))
  }

  if (collectionIds.length > 0) {
    const collections = await getCollectionsByIds(collectionIds)
    collections.forEach((collection) =>
      addPath(paths, '/collection/' + collection.urlId)
    )

    const libraries = (
      await Promise.all(
        collections.map((collection) => getLibrariesForCollection(collection._id))
      )
    ).flat()

    libraries.forEach((library) => addPath(paths, '/library/' + library.urlId))
  }

  return Array.from(paths)
}

export async function revalidatePaths(
  res: RevalidateableResponse,
  paths: string[]
) {
  if (typeof res.revalidate !== 'function') {
    return
  }

  for (const path of Array.from(new Set(paths))) {
    try {
      await res.revalidate(path)
    } catch (error) {
      console.error('Failed to revalidate path', path, error)
    }
  }
}
