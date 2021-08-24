import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {deleteColumn} from "../../../lib/db/columns"

export default async function apiDeleteTab(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d._id !== "") {
            // delete does not reorder!!!
            await deleteColumn(d._id)
            res.status(200).send("Deleted")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
