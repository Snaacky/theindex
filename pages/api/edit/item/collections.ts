import { auth } from '../../../../auth'
import { canEdit } from '../../../../lib/session'
import { getSingleCache, updateAllCache } from '../../../../lib/db/cache'
import { getCollectionsForItem } from '../../../../lib/db/publicData'
import { updateItemCollections } from '../../../../lib/db/items'
import { Types } from '../../../../types/Components'
import type { Item } from '../../../../types/Item'
import { NextApiRequest, NextApiResponse } from 'next'
import { getItemRelatedPaths, revalidatePaths } from '../../../../lib/revalidate'

export default async function apiEditColumnCollections(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (canEdit(session)) {
    const d = req.body
    if (typeof d._id !== 'undefined' && Array.isArray(d.collections)) {
      const item = (await getSingleCache(Types.item, d._id)) as Item | null
      const previousCollectionIds = (await getCollectionsForItem(d._id)).map(
        (collection) => collection._id
      )
      const collections = d.collections.map((t) =>
        typeof t === 'string' ? t : t._id
      )
      await updateItemCollections(d._id, collections)
      await updateAllCache(Types.collection)
      await revalidatePaths(
        res,
        await getItemRelatedPaths(item, Array.from(new Set(previousCollectionIds.concat(collections))))
      )
      return res.status(200).send('Ok')
    } else {
      return res.status(400).send('Missing _id or collections')
    }
  } else {
    // Not Signed in
    return res.status(401).send('Not logged in or edits are not permitted')
  }
}
