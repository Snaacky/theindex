import {getSession} from "next-auth/client"
import {canEdit} from "../../../../lib/session"
import {updateTableColumns} from "../../../../lib/db/tables"

export default async function apiEditTableItems(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (typeof d._id !== "undefined" && Array.isArray(d.columns)) {
            const columns = d.columns.map(t => typeof t === "string" ? t : t._id)
            await updateTableColumns(d._id, columns)
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing _id or items")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
