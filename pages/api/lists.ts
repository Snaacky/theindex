import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'

export default async function handler(req, res) {
  res.status(200).json(await getAllCache(Types.list, false))
}
