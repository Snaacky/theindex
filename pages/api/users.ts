import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { isAdmin } from '../../lib/session'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (isAdmin(session)) {
    res.json(await getAllCache(Types.user))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
}
