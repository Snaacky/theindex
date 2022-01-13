import { getSingleCache } from '../../../lib/db/cache'
import { Types } from '../../../types/Components'

export default async function apiLibrary(req, res) {
  res.status(200).json(await getSingleCache(Types.library, req.query.id, false))
}
