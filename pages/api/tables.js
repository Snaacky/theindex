import {getTables} from "../../lib/db/tables"

export default function handler(req, res) {
    res.status(200).json(getTables())
}
