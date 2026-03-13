import {
  openItemScreenshotStream,
} from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stream = await openItemScreenshotStream(req.query.id as string)
    let started = false

    stream.once('file', () => {
      started = true
      res.setHeader('Content-Type', 'image/png')
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=86400, stale-while-revalidate=604800'
      )
      stream.pipe(res)
    })

    stream.once('error', (error) => {
      if (!started) {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=3600, stale-while-revalidate=86400'
        )
        res.redirect('/no-screenshot.png')
        return
      }

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
  } catch (e) {
    console.log(
      'Something horribly went wrong while opening the screenshot stream :(',
      e
    )
    res.status(500).send(e.toString())
  }
}
