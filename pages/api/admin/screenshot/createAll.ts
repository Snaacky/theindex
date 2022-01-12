import { getSession } from 'next-auth/client'
import { isAdmin } from '../../../../lib/session'
import createScreenshot from '../../../../lib/crawler/screenshot'
import { getItems } from '../../../../lib/db/items'

export default async function apiAdminScreenshotCreateAll(req, res) {
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
    await createScreenshot(item._id)
  }

  console.log('Created all screenshots')
  res.status(200).send('Created screenshots')
}
