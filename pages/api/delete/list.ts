import { getSession } from 'next-auth/client'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import { deleteList, getList } from '../../../lib/db/lists'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiDeleteList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const d = req.body
  const list = await getList(d._id)
  if (isCurrentUser(session, list.owner) || isAdmin(session)) {
    if (d._id !== '') {
      await deleteList(d._id)

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
