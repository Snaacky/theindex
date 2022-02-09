import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiItems(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await getAllCache(Types.item, false))
}
