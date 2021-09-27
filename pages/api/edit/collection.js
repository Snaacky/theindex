import { getSession } from 'next-auth/client'
import { canEdit } from '../../../lib/session'
import { addCollection, updateCollection } from '../../../lib/db/collections'

export default async function apiEditCollection(req, res) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (d.urlId === '_new') {
      res.status(400).send("Illegal url id: '_new' is forbidden!")
    } else {
      if (typeof d._id === 'undefined') {
        await addCollection(
          d.urlId,
          d.img,
          d.name,
          d.nsfw,
          d.description,
          d.items
        )
      } else {
        await updateCollection(d._id, d)
      }
      res.status(200).send('Ok')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
