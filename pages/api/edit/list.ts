import { getSession } from 'next-auth/react'
import { isAdmin, isCurrentUser, isLogin } from '../../../lib/session'
import { addList, getList, updateList } from '../../../lib/db/lists'
import { updateAllCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const d = req.body
  if (isLogin(session)) {
    if (
      typeof d._id === 'undefined' &&
      (isCurrentUser(session, d.owner) || isAdmin(session))
    ) {
      if (d.owner !== '' && d.name !== '') {
        const id = await addList(
          d.owner,
          d.name,
          d.nsfw,
          d.description,
          d.columns
        )
        res.status(200).send(id)
      } else {
        res.status(400).send('Missing owner or name')
      }
    } else {
      const list = await getList(d._id)
      if (isCurrentUser(session, list.owner) || isAdmin(session)) {
        await updateList(d._id, d)
        await updateAllCache(Types.list)
        res.status(200).send(d._id)
      } else {
        res.status(401).send('Not logged in or edits are not permitted')
      }
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
