import {getAllItems} from "../../lib/db/db"

export default function handler(req, res) {
    res.status(200).json(getAllItems())
}
