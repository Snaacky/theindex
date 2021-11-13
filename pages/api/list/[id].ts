import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'

export default async function apiList(req, res) {
  res.status(200).send(await getSingleCache(Types.list, req.query.id, false))
}
