import {exportData} from "../../lib/db/db";

export default async function handler(req, res) {
    const d = await exportData()
    res.status(200).json(d)
}
