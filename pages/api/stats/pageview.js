import { getSession } from 'next-auth/client'
import { isLogin } from '../../../lib/session'
import { findOne } from '../../../lib/db/db'
import { addView } from '../../../lib/db/views'

export default async function handler(req, res) {
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
        const session = await getSession({ req })
        const body = {
          type,
          contentId: type === 'user' ? exists.uid : exists._id,
          uid: isLogin(session) ? session.user.uid : 'guest',
        }
        await addView(body)
        res.status(200).json(body)
      } else {
        res.status(404).json({
          status: 'Content does not exist',
        })
      }
    } else {
      res.status(200).json({
        status: 'Page not tracked',
      })
    }
  } else {
    res.status(400).json({
      error: 'Missing url',
    })
  }
  res.end()
}
