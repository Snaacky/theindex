import { auth } from '../../../../auth'
import { isAdmin } from '../../../../lib/session'
import { clearCompleteCache } from '../../../../lib/db/cache'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiAdminCacheClear(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (!isAdmin(session)) {
    return res.status(401)
  }

  if (!req.body.clearCache) {
    return res.status(403).send('Are you sure you want to clear the cache?')
  }

  if ((await clearCompleteCache()) === 'OK') {
    console.log('Cleared cache')
    res.status(200).send('Cache cleared')
  } else {
    res.status(500).send('Something went wrong, check the logs')
  }
}
