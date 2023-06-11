import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { canEdit } from '../../../../lib/session'
import { updateCollectionLibraries } from '../../../../lib/db/collections'
import { updateAllCache } from '../../../../lib/db/cache'
import { Types } from '../../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditCollectionLibraries(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (canEdit(session)) {
    const d = req.body
    if (typeof d._id !== 'undefined' && Array.isArray(d.libraries)) {
      const libraries = d.libraries.map((t) =>
        typeof t === 'string' ? t : t._id
      )
      await updateCollectionLibraries(d._id, libraries)
      await updateAllCache(Types.library)
      res.status(200).send('Ok')
    } else {
      res.status(400).send('Missing _id or libraries')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
