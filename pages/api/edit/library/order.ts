import { getSession } from 'next-auth/client'
import { canEdit } from '../../../../lib/session'
import { updateLibrary } from '../../../../lib/db/libraries'
import { updateAllCache } from '../../../../lib/db/cache'
import { Types } from '../../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiEditLibraryOrder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (canEdit(session)) {
    const d = req.body
    if (Array.isArray(d.libraries)) {
      await Promise.all(
        d.libraries.map(
          async (t, i) =>
            await updateLibrary(typeof t === 'string' ? t : t._id, { order: i })
        )
      )

      await updateAllCache(Types.library)
      res.status(200).send('Ok')
    } else {
      res.status(400).send('Missing libraries')
    }
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
