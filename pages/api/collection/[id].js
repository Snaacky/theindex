import { getCollection } from '../../../lib/db/collections'

export default async function handler(req, res) {
  res.status(200).json(await getCollection(req.query.id))
}
