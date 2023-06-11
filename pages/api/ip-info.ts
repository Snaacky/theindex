import { lookup } from 'geoip-lite'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ipInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (Array.isArray(ip)) {
    ip = ip[0]
  }

  if (typeof ip === 'undefined') {
    res.status(500).end()
    return
  }

  ip = ip.split(', ')[0]

  const geo = lookup(ip)
  res.json({
    ip,
    geo,
  })
  res.end()
}
