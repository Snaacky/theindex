import { auth } from '../../../auth'
import { canEdit } from '../../../lib/session'
import { deleteColumn } from '../../../lib/db/columns'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiDeleteColumn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (canEdit(session)) {
    const d = req.body
    if (d._id !== '') {
      await deleteColumn(d._id)

      return res.status(200).send('Deleted')
    } else {
      return res.status(400).send('Missing _id')
    }
  } else {
    // Not Signed in
    return res.status(401).send('Not logged in or edits are not permitted')
  }
}
