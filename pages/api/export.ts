import { getSession } from 'next-auth/client'
import { exportData } from '../../lib/db/db'
import { isAdmin } from '../../lib/session'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (isAdmin(session)) {
    const d = await exportData()
    res.status(200).json(d)
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
