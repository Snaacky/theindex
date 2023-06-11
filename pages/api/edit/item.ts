import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { canEdit } from '../../../lib/session'
import { addItem, updateItem } from '../../../lib/db/items'
import createScreenshot from '../../../lib/crawler/screenshot'
import { updateAllCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { User } from '../../../types/User'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (canEdit(session)) {
    const d = req.body
    let id = d._id
    if (typeof d._id === 'undefined') {
      id = await addItem(
        d.name,
        d.urls,
        d.nsfw,
        d.description,
        d.blacklist,
        d.sponsor,
        d.data,
        session.user as User
      )
      if (d.urls.length > 0) {
        createScreenshot(id).then(() =>
          console.log('Screenshot', id, 'created')
        )
      }
    } else {
      await updateItem(d._id, d, session.user as User)
      await updateAllCache(Types.item)
      if (d.urls.length > 0) {
        createScreenshot(d._id).then(() =>
          console.log('Screenshot', d._id, 'created')
        )
      }
    }
    res.status(200).send(id)
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
