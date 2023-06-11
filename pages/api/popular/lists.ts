import { getLastViews } from '../../../lib/db/views'
import { NextApiRequest, NextApiResponse } from 'next'
import { Types } from '../../../types/Components'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await getLastViews(Types.list, 1000))
}
