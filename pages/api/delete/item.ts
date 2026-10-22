import { auth } from '../../../auth'
import { canEdit } from '../../../lib/session'
import { getSingleCache } from '../../../lib/db/cache'
import { getCollectionsForItem } from '../../../lib/db/publicData'
import { deleteItem } from '../../../lib/db/items'
import { User } from '../../../types/User'
import { Types } from '../../../types/Components'
import type { Item } from '../../../types/Item'
import { NextApiRequest, NextApiResponse } from 'next'
import { getItemRelatedPaths, revalidatePaths } from '../../../lib/revalidate'

export default async function apiDeleteItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (canEdit(session) && session !== null) {
    const d = req.body
    if (d._id !== '') {
      const item = (await getSingleCache(Types.item, d._id)) as Item | null
      const collectionIds = (await getCollectionsForItem(d._id)).map(
        (collection) => collection._id
      )
      await deleteItem(d._id, session.user as User)
      await revalidatePaths(
        res,
        await getItemRelatedPaths(item, collectionIds)
      )

      return res.status(200).send('Deleted')
    } else {
      return res.status(400).send('Missing _id')
    }
  } else {
    // Not Signed in
    return res.status(401).send('Not logged in or edits are not permitted')
  }
}
