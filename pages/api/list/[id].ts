import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../../lib/api'

export default async function apiList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res)
  res.json(await getSingleCache(Types.list, req.query.id as string))
}
