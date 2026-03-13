import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../lib/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res)
  res.json(await getAllCache(Types.list))
}
