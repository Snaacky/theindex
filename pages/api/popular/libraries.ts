import { getLastViews } from '../../../lib/db/views'

export default async function handler(req, res) {
    res.status(200).json(await getLastViews('library', 100))
}
