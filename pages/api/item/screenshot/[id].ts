import {
  openItemScreenshotStream,
  screenshotExists,
} from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const itemId = req.query.id as string
    if (!(await screenshotExists(itemId))) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
      )
      return res.redirect('/no-screenshot.png')
    }

    const stream = await openItemScreenshotStream(itemId)
    res.setHeader('Content-Type', 'image/png')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=604800'
    )

    stream.once('error', (error) => {
      console.log(
        'Something horribly went wrong while fetching the screenshot :(',
        error
      )
      if (!res.headersSent) {
        res.status(500).send(error.toString())
      } else {
        res.destroy(error as Error)
      }
    })
    res.once('close', () => {
      stream.destroy()
    })
    stream.pipe(res)
  } catch (e) {
    console.log(
      'Something horribly went wrong while opening the screenshot stream :(',
      e
    )
    res.status(500).send(e.toString())
  }
}
