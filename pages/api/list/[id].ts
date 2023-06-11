import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await getSingleCache(Types.list, req.query.id as string))
}
