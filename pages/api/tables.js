import {getTables} from "../../lib/db/tables"

export default async function handler(req, res) {
    res.status(200).json(await getTables())
}
