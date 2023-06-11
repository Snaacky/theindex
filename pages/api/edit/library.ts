import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { canEdit } from '../../../lib/session'
import { addLibrary, updateLibrary } from '../../../lib/db/libraries'
import { updateAllCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditLibrary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (canEdit(session)) {
    const d = req.body
    if (d.urlId !== '' && d.name !== '') {
      if (d.urlId === '_new') {
        res.status(400).send('Illegal url id: "_new" is forbidden!')
      } else {
        let id = d._id
        if (typeof d._id === 'undefined') {
          id = await addLibrary(
            d.urlId,
            d.img,
            d.name,
            d.nsfw,
            d.description,
            d.collections
          )
        } else {
          await updateLibrary(d._id, d)
          await updateAllCache(Types.library)
        }
        res.status(200).send(id)
      }
    } else {
      res.status(400).send('Missing url id or name')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
