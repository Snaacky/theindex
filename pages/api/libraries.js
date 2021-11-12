import { getLibrariesWithCollections } from '../../lib/db/libraries'

export default async function handler(req, res) {
  res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=60, stale-while-revalidate=59'
  )
  res.status(200).json(await getLibrariesWithCollections())
}
