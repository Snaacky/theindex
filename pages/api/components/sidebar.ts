import { getCache, setCache } from '../../../lib/db/cache'
import { getLibrariesWithCollections } from '../../../lib/db/libraries'

export default async function sidebar(req, res) {
  const key = 'component-sidebar'
  let cache = await getCache(key, false)
  if (cache === null) {
    cache = await getLibrariesWithCollections()
    setCache(key, cache)
  }

  res.status(200).send(cache)
}
