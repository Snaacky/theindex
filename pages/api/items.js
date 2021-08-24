import {getItems} from "../../lib/db/items"

export default function handler(req, res) {
    res.status(200).json(getItems())
}
