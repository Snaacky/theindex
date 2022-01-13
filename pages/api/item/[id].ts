import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'

export default async function apiItem(req, res) {
  res.status(200).json(await getSingleCache(Types.item, req.query.id, false))
}
