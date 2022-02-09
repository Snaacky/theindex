import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiLibrary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res
    .status(200)
    .json(await getSingleCache(Types.library, req.query.id as string, false))
}
