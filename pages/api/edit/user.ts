import { auth } from '../../../auth'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import { updateUser } from '../../../lib/db/users'
import { updateAllCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  const d = req.body
  if (d.uid !== '') {
    if (
      session !== null &&
      (isAdmin(session) || isCurrentUser(session, d.uid))
    ) {
      if (!isAdmin(session) && d.accountType) {
        delete d.accountType
      }
      await updateUser(d.uid === 'me' ? session.user.uid : d.uid, d)
      await updateAllCache(Types.user)
      res.status(200).send(d.uid)
    } else {
      // Not Signed in
      res.status(401).send('Not logged in or edits are not permitted')
    }
  } else {
    res.status(400).send('Missing uid')
  }
  res.end()
}
