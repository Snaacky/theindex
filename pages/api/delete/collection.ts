import { getSession } from 'next-auth/react'
import { canEdit } from '../../../lib/session'
import { deleteCollection } from '../../../lib/db/collections'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiDeleteCollection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (d._id !== '') {
      await deleteCollection(d._id)

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
