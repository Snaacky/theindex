import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiCollection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await getSingleCache(Types.collection, req.query.id as string))
}
