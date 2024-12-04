import { auth } from '../../../auth'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import { updateUser } from '../../../lib/db/users'
import { updateAllCache, updateSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { findOneTyped } from '../../../lib/db/dbTyped'
import type { User } from '../../../types/User'

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
      // @ts-ignore
      const oldUser = (await findOneTyped(
        Types.user,
        d.uid === 'me' ? session.user.uid : d.uid
      )) as User

      // @ts-ignore
      await updateUser(d.uid === 'me' ? session.user.uid : d.uid, d)
      await updateAllCache(Types.user)
      if (d.favs) {
        d.favs
          .filter((fav) => !oldUser.favs.includes(fav))
          .concat(oldUser.favs.filter((fav) => !d.favs.includes(fav)))
          .forEach((fav) => updateSingleCache(Types.item, fav))
      }
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
