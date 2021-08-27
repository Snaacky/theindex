import {getColumn} from "../../../lib/db/columns"

export default async function handler(req, res) {
    res.status(200).json(await getColumn(req.query.id))
}
