import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { isAdmin } from '../../../../lib/session'
import createScreenshot from '../../../../lib/crawler/screenshot'
import { getItems } from '../../../../lib/db/items'
import { screenshotExists } from '../../../../lib/db/itemScreenshots'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiAdminScreenshotCreateAll(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!isAdmin(session)) {
    return res.status(401)
  }

  if (!req.body.createAll) {
    return res
      .status(403)
      .send('Are you sure you want to take screenshots of all items?')
  }

  const items = (
    await Promise.all(
      (
        await getItems()
      ).map(async (item) => {
        if (await screenshotExists(item._id)) {
          return null
        }
        return item
      })
    )
  ).filter((item) => item !== null)

  const batchSize = 10
  let i = 0
  while (i < items.length) {
    await Promise.all(
      items
        .slice(i, i + Math.min(batchSize, items.length - i))
        .map(async (item) => {
          await createScreenshot(item._id).catch(() => {
            console.error(
              'Screenshot creation failed in batch creation for',
              item._id
            )
          })
        })
    )
    i += batchSize
  }

  console.log('Created all screenshots')
  res.status(200).send('Created screenshots')
}
