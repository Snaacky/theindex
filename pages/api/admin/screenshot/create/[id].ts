import { auth } from '../../../../../auth'
import { isEditor } from '../../../../../lib/session'
import createScreenshot from '../../../../../lib/crawler/screenshot'
import { getItem } from '../../../../../lib/db/items'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiAdminScreenshotCreateId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (!isEditor(session)) {
    return res.status(401)
  }

  const item = await getItem(req.query.id as string)
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
    const succeeded = await createScreenshot(req.query.id as string)
    if (succeeded) {
      console.log('Created screenshots')
      res.status(200).send('Created screenshots')
    } else {
      console.log('Failed to create screenshots')
      res.status(500).send('Failed to create screenshots')
    }
  }
}
