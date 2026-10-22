import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../../../lib/api'
import {
  ensureItemStatusPolling,
  getItemStatusResponse,
} from '../../../../lib/itemStatus'

export default async function apiItemPing(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res, 30, 300)
  ensureItemStatusPolling()
  const status = await getItemStatusResponse(req.query.id as string)
  if (status === null) {
    return res.status(404).end()
  }

  res.json(status)
}
