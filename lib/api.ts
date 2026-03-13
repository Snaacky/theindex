import { NextApiResponse } from 'next'

export function setPublicApiCache(
  res: NextApiResponse,
  sMaxAge = 60,
  staleWhileRevalidate = 600
) {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  )
}
