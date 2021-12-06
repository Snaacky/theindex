import { getSession } from 'next-auth/client'
import { isAdmin } from '../../../../lib/session'
import { clearAllScreenshots } from '../../../../lib/db/itemScreenshots'

export default async function apiAdminScreenshotClear(req, res) {
  const session = await getSession({ req })
  if (!isAdmin(session)) {
    return res.status(401)
  }

  if (!req.body.clearScreenshot) {
    return res.status(403).send('Are you sure you want to clear the cache?')
  }

  await clearAllScreenshots()
  console.log('Cleared cache')
  res.status(200).send('Cache cleared')
}
