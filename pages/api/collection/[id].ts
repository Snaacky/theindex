import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'

export default async function apiCollection(req, res) {
  res
    .status(200)
    .send(await getSingleCache(Types.collection, req.query.id, false))
}
