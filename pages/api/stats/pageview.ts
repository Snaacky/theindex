import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { isLogin } from '../../../lib/session'
import { findOne } from '../../../lib/db/db'
import { addView } from '../../../lib/db/views'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function statsPageView(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.url && typeof req.body.url === 'string') {
    const split = req.body.url.split('/')
    if (split.length === 3 && split[1] !== 'admin') {
      const type = split[1]
      const contentId = split[2]

      let exists = null
      if (type === 'item') {
        exists = await findOne('items', { _id: contentId })
      } else if (type === 'collection') {
        exists = await findOne('collections', { urlId: contentId })
      } else if (type === 'library') {
        exists = await findOne('libraries', { urlId: contentId })
      } else if (type === 'column') {
        exists = await findOne('columns', { urlId: contentId })
      } else if (type === 'user') {
        exists = await findOne('users', { uid: contentId })
      } else if (type === 'list') {
        exists = await findOne('lists', { _id: contentId })
      }

      if (exists !== null) {
        const session = await getServerSession(req, res, authOptions)
        const body = {
          type,
          contentId: type === 'user' ? exists.uid : exists._id,
          uid: isLogin(session) ? session.user.uid : 'guest',
        }
        await addView(body)
        res.json(body)
      } else {
        res.json({
          status: 'Content does not exist',
        })
      }
    } else {
      res.json({
        status: 'Page not tracked',
      })
    }
  } else {
    res.json({
      error: 'Missing url',
    })
  }
}
