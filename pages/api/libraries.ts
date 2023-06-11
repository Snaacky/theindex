import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiLibraries(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await getAllCache(Types.library))
}
