import { getSession } from 'next-auth/react'
import { isAdmin } from '../../lib/session'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (isAdmin(session)) {
    res.status(200).json(await getAllCache(Types.user))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
}
