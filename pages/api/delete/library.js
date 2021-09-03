import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {deleteLibrary} from "../../../lib/db/libraries"

export default async function apiDeleteTab(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d._id !== "") {
            // delete does not reorder!!!
            await deleteLibrary(d._id)
            res.status(200).send("Deleted")
        } else {
            res.status(400).send("Missing _id")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
