import { getSession } from 'next-auth/react'
import { isLogin } from '../../../lib/session'
import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result = {}
  if (req.query.id === 'me') {
    const session = await getSession({ req })
    if (isLogin(session)) {
      result = await getSingleCache(Types.user, session.user.uid)
    } else {
      return res.status(200).end()
    }
  } else {
    result = await getSingleCache(Types.user, req.query.id as string)
  }

  res.status(200).json(result)
}
