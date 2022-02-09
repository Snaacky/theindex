import { getItem } from '../../../../lib/db/items'
import { getSession } from 'next-auth/react'
import {
  getItemScreenshotBuffer,
  screenshotExists,
} from '../../../../lib/db/itemScreenshots'
import createScreenshot from '../../../../lib/crawler/screenshot'
import { isAdmin } from '../../../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const item = await getItem(req.query.id as string)
  if (item) {
    try {
      if (await screenshotExists(item._id)) {
        const screenshotBuffer = await getItemScreenshotBuffer(item._id)
        if (screenshotBuffer !== null) {
          res.setHeader('Content-Type', 'image/png')
          res.send(screenshotBuffer)
        } else {
          res
            .status(500)
            .send('Something went wrong here.. no image stream found')
        }
      } else {
        if (isAdmin(session)) {
          console.log('Admin and missing screenshot, creating new')
          await createScreenshot(item._id)
        }
        res.redirect('/no-screenshot.png')
      }
    } catch (e) {
      console.log('Something horribly went wrong :(', e)
      res.status(500).send(e.toString())
    }
  } else {
    res.status(404).end()
  }
}
