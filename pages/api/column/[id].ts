import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../../lib/api'

export default async function apiColumn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res)
  res.json(await getSingleCache(Types.column, req.query.id as string))
}
