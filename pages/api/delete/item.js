import { getSession } from 'next-auth/client'
import { canEdit } from '../../../lib/session'
import { deleteItem } from '../../../lib/db/items'

export default async function apiDeleteItem(req, res) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (d._id !== '') {
      await deleteItem(d._id)

      res.status(200).send('Deleted')
    } else {
      res.status(400).send('Missing _id')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
