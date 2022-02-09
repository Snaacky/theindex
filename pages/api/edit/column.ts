import { getSession } from 'next-auth/client'
import { canEdit } from '../../../lib/session'
import { addColumn, updateColumn } from '../../../lib/db/columns'
import { updateAllCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditColumn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (typeof d._id === 'undefined') {
      if (d.urlId !== '' && d.name !== '') {
        if (d.urlId === '_new') {
          res.status(400).send('Illegal url id: "_new" is forbidden!')
        } else {
          const id = await addColumn(
            d.urlId,
            d.name,
            d.nsfw,
            d.description,
            d.type,
            d.values
          )
          res.status(200).send(id)
        }
      } else {
        res.status(400).send('Missing url id or name')
      }
    } else {
      await updateColumn(d._id, d)
      await updateAllCache(Types.column)
      res.status(200).send(d._id)
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
