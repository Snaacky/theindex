import { getLists } from '../../lib/db/lists'

export default async function handler(req, res) {
  res.status(200).json(await getLists())
}
