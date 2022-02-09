import { getSession } from 'next-auth/react'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import { getUser, updateUser } from '../../../lib/db/users'
import { updateAllCache, updateSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const d = req.body
  if (d.uid !== '') {
    if (isAdmin(session) || isCurrentUser(session, d.uid)) {
      if (!isAdmin(session) && d.accountType) {
        delete d.accountType
      }
      // @ts-ignore
      const oldUser = await getUser(d.uid === 'me' ? session.user.uid : d.uid)

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
