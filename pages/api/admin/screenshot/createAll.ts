import { getSession } from 'next-auth/client'
import { isAdmin } from '../../../../lib/session'
import createScreenshot from '../../../../lib/crawler/screenshot'
import { getItems } from '../../../../lib/db/items'
import { screenshotExists } from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiAdminScreenshotCreateAll(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!isAdmin(session)) {
    return res.status(401)
  }

  if (!req.body.createAll) {
    return res
      .status(403)
      .send('Are you sure you want to take screenshots of all items?')
  }

  const items = await getItems()
  for (let item of items) {
    if (!(await screenshotExists(item._id))) {
      await createScreenshot(item._id)
    }
  }

  console.log('Created all screenshots')
  res.status(200).send('Created screenshots')
}
