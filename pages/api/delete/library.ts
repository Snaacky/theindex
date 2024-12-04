import { auth } from '../../../auth'
import { canEdit } from '../../../lib/session'
import { deleteLibrary } from '../../../lib/db/libraries'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiDeleteLibrary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (canEdit(session)) {
    const d = req.body
    if (d._id !== '') {
      // delete does not reorder!!!
      await deleteLibrary(d._id)

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
