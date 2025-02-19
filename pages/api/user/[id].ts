import { auth } from '../../../auth'
import { isAdmin, isLogin } from '../../../lib/session'
import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { findOne } from '../../../lib/db/db'
import { ObjectId } from 'mongodb'

export default async function apiUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)

  let result: object | null = null
  if (req.query.id === 'me') {
    if (isLogin(session) && session !== null) {
      result = await getSingleCache(Types.user, session.user.uid)
    } else {
      return res.json(null)
    }
  } else {
    const uId = req.query.id as string
    const user = await getSingleCache(Types.user, uId)

    if (isAdmin(session)) {
      const userAccount = await findOne('nextauth_users', {
        _id: new ObjectId(uId),
      })
      const discordAccount = await findOne('nextauth_accounts', {
        userId: new ObjectId(uId),
      })

      result = {
        user,
        userAccount,
        discordAccount,
      }
    } else {
      result = user
    }
  }

  res.json(result)
}
