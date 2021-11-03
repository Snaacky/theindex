import { lookup } from 'geoip-lite'

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const geo = lookup(ip)
  res.status(200).json({
    ip,
    geo,
  })
  res.end()
}
