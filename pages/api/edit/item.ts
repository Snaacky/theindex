import { auth } from '../../../auth'
import { canEdit } from '../../../lib/session'
import { getSingleCache, updateAllCache } from '../../../lib/db/cache'
import { getCollectionsForItem } from '../../../lib/db/publicData'
import { addItem, updateItem } from '../../../lib/db/items'
import createScreenshot from '../../../lib/crawler/screenshot'
import { Types } from '../../../types/Components'
import { User } from '../../../types/User'
import type { Item } from '../../../types/Item'
import { NextApiRequest, NextApiResponse } from 'next'
import { getItemRelatedPaths, revalidatePaths } from '../../../lib/revalidate'

export default async function apiEditItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (canEdit(session) && session !== null) {
    const d = req.body
    let id = d._id
    let oldItem: Item | null = null
    let oldCollectionIds: string[] = []
    if (typeof d._id === 'string' && d._id !== '') {
      oldItem = (await getSingleCache(Types.item, d._id)) as Item | null
      oldCollectionIds = (await getCollectionsForItem(d._id)).map(
        (collection) => collection._id
      )
    }
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
    const newItem = (await getSingleCache(Types.item, id)) as Item | null
    await revalidatePaths(
      res,
      Array.from(
        new Set([
          ...(await getItemRelatedPaths(oldItem, oldCollectionIds)),
          ...(await getItemRelatedPaths(newItem, oldCollectionIds)),
        ])
      )
    )
    return res.status(200).send(id)
  } else {
    // Not Signed in
    return res.status(401).send('Not logged in or edits are not permitted')
  }
}
