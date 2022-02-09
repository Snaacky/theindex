import { getLastViews } from '../../../lib/db/views'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await getLastViews('list', 100))
}
