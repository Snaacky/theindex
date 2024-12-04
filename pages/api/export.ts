import { auth } from '../../auth'
import { exportData } from '../../lib/db/db'
import { isAdmin, isLogin } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)
  if (isLogin(session)) {
    res.json(await exportData(isAdmin(session)))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
