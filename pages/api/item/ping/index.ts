import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../../../lib/api'
import {
  ensureItemStatusPolling,
  getItemStatusResponse,
} from '../../../../lib/itemStatus'

export default async function apiItemPingBatch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res, 30, 300)
  ensureItemStatusPolling()

  const ids = typeof req.query.ids === 'string' ? req.query.ids.split(',') : []
  const uniqueIds = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)))

  if (uniqueIds.length === 0) {
    return res.status(400).json({ error: 'Missing ids query parameter' })
  }

  const statuses = await Promise.all(
    uniqueIds.map(async (itemId) => [itemId, await getItemStatusResponse(itemId)])
  )

  res.json(Object.fromEntries(statuses))
}
