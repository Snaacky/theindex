import {getItems} from "../../lib/db/items"

export default async function handler(req, res) {
    res.status(200).json(await getItems())
}
