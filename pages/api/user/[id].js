import { getSession } from 'next-auth/client'
import { isLogin } from '../../../lib/session'
import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'

export default async function apiUser(req, res) {
  let result = {}
  if (req.query.id === 'me') {
    const session = await getSession({ req })
    if (isLogin(session)) {
      result = await getSingleCache(Types.user, session.user.uid, false)
    } else {
      return res.status(401)
    }
  } else {
    result = await getSingleCache(Types.user, req.query.id, false)
  }

  res.status(200).json(result)
}
