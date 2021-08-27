import {getTabsWithTables} from "../../lib/db/tabs"

export default async function handler(req, res) {
    res.status(200).json(await getTabsWithTables())
}
