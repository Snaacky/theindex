import { getSingleCache } from '../../../../lib/db/cache'
import {
  getItemScreenshotBuffer,
  screenshotExists,
} from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'
import { Types } from '../../../../types/Components'
import type { Item } from '../../../../types/Item'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const item = (await getSingleCache(
    Types.item,
    req.query.id as string
  )) as Item | null
  if (item) {
    try {
      if (await screenshotExists(item._id)) {
        const screenshotBuffer = await getItemScreenshotBuffer(item._id)
        if (screenshotBuffer !== null) {
          res.setHeader('Content-Type', 'image/png')
          res.setHeader(
            'Cache-Control',
            'public, s-maxage=86400, stale-while-revalidate=604800'
          )
          res.send(screenshotBuffer)
        } else {
          res
            .status(500)
            .send('Something went wrong here.. no image stream found')
        }
      } else {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=3600, stale-while-revalidate=86400'
        )
        res.redirect('/no-screenshot.png').end()
      }
    } catch (e) {
      console.log(
        'Something horribly went wrong while fetching the screenshot :(',
        e
      )
      res.status(500).send(e.toString())
    }
  } else {
    res.status(404).end()
  }
}
