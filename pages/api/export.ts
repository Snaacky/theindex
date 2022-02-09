import { getSession } from 'next-auth/react'
import { exportData } from '../../lib/db/db'
import { isAdmin, isLogin } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (isLogin(session)) {
    res.status(200).json(await exportData(isAdmin(session)))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
