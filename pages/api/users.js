import { getUsers } from '../../lib/db/users'
import { getSession } from 'next-auth/client'
import { isAdmin } from '../../lib/session'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (isAdmin(session)) {
    res.status(200).json(await getUsers())
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
}
