import { auth } from '../../../../../auth'
import { isEditor } from '../../../../../lib/session'
import createScreenshot from '../../../../../lib/crawler/screenshot'
import { getItem } from '../../../../../lib/db/items'
import { NextApiRequest, NextApiResponse } from 'next'
import { addItemScreenshot } from '../../../../../lib/db/itemScreenshots'

export default async function apiAdminScreenshotUploadId(
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
      'Cannot upload screenshot for ',
      req.query.id,
      ': item not found'
    )
    res
      .status(404)
      .send('Cannot upload screenshot for ' + req.query.id + ': item not found')
  } else {
    try {
      const screenshotBase64 = req.body.screenshot
      const screenshot = atob(screenshotBase64)
      const uint8Array = new Uint8Array(screenshot.length)
      for (let i = 0; i < screenshot.length; i++) {
        uint8Array[i] = screenshot.charCodeAt(i)
      }
      await addItemScreenshot(uint8Array, item._id)
      console.log('Uploaded screenshot')
      res.status(200).send('Uploaded screenshot')
    } catch (error) {
      console.log('Failed to upload screenshot', error)
      res.status(500).send('Failed to upload screenshot')
    }
  }
}
