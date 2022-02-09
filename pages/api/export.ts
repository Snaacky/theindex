import { getSession } from 'next-auth/react'
import { dbClient, exportData } from '../../lib/db/db'
import { isAdmin, isLogin } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (
    typeof req.body === 'string' &&
    req.body.length > 0 &&
    req.body === process.env.NEXTAUTH_SECRET
  ) {
    const db = (await dbClient).db()
    res.status(200).json({
      nextauth: {
        accounts: await db.collection('nextauth_accounts').find().toArray(),
        users: await db.collection('nextauth_users').find().toArray(),
        sessions: await db.collection('nextauth_sessions').find().toArray(),
      },
      users: await db.collection('users').find().toArray(),
    })
  } else if (isLogin(session)) {
    res.status(200).json(await exportData(isAdmin(session)))
  } else {
    // Not Signed in
    res.status(401).send('Not logged in or edits are not permitted')
  }
  res.end()
}
