import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await getSingleCache(Types.item, req.query.id as string))
}
