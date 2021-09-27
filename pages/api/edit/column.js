import { getSession } from 'next-auth/client'
import { canEdit } from '../../../lib/session'
import { addColumn, updateColumn } from '../../../lib/db/columns'

export default async function apiEditColumn(req, res) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (typeof d._id === 'undefined') {
      if (d.urlId !== '' && d.name !== '') {
        if (d.urlId === '_new') {
          res.status(400).send("Illegal url id: '_new' is forbidden!")
        } else {
          await addColumn(
            d.urlId,
            d.name,
            d.nsfw,
            d.description,
            d.type,
            d.values
          )
          res.status(200).send('Ok')
        }
      } else {
        res.status(400).send('Missing url id or name')
      }
    } else {
      await updateColumn(d._id, d)
      res.status(200).send('Ok')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
