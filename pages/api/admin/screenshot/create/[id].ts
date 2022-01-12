import { getSession } from 'next-auth/client'
import { isEditor } from '../../../../../lib/session'
import createScreenshot from '../../../../../lib/crawler/screenshot'
import { getItem } from '../../../../../lib/db/items'

export default async function apiAdminScreenshotCreateId(req, res) {
  const session = await getSession({ req })
  if (!isEditor(session)) {
    return res.status(401)
  }

  const item = await getItem(req.query.id)
  if (item === null) {
    console.warn(
      'Cannot create screenshot for ',
      req.query.id,
      ': item not found'
    )
    res
      .status(404)
      .send('Cannot create screenshot for ' + req.query.id + ': item not found')
  } else {
    const succeded = await createScreenshot(req.query.id)
    if (succeded) {
      console.log('Created screenshots')
      res.status(200).send('Created screenshots')
    } else {
      console.log('Failed to create screenshots')
      res.status(500).send('Failed to create screenshots')
    }
  }
}
