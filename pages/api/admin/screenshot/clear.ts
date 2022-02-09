import { getSession } from 'next-auth/client'
import { isAdmin } from '../../../../lib/session'
import { clearAllScreenshots } from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiAdminScreenshotClear(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!isAdmin(session)) {
    return res.status(401)
  }

  if (!req.body.clearScreenshot) {
    return res
      .status(403)
      .send('Are you sure you want to wipe all screenshots?')
  }

  await clearAllScreenshots()
  console.log('Wiped screenshots')
  res.status(200).send('Wiped screenshots')
}
