import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await getSingleCache(Types.list, req.query.id as string))
}
