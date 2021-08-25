import {getSession} from "next-auth/client"
import {canEdit} from "../../../../lib/session"
import {updateTableItems} from "../../../../lib/db/tables"

export default async function apiEditTableItems(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (typeof d._id !== "undefined" && Array.isArray(d.items)) {
            await updateTableItems(d._id, d.items)
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
