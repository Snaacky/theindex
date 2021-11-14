import { getSession } from 'next-auth/client'
import { isAdmin } from '../../lib/session'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'

export default async function apiUsers(req, res) {
  const session = await getSession({ req })
  if (isAdmin(session)) {
    res.status(200).send(await getAllCache(Types.user, false))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
}
