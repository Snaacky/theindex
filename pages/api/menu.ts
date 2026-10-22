import { NextApiRequest, NextApiResponse } from 'next'
import { setPublicApiCache } from '../../lib/api'
import { getMenuData } from '../../lib/db/publicData'

export default async function apiMenu(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setPublicApiCache(res)
  res.json(await getMenuData())
}
