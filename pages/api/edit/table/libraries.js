import {getSession} from "next-auth/client"
import {canEdit} from "../../../../lib/session"
import {updateTableLibraries} from "../../../../lib/db/tables"

export default async function apiEditTableLibraries(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (typeof d._id !== "undefined" && Array.isArray(d.libraries)) {
            const libraries = d.libraries.map(t => typeof t === "string" ? t : t._id)
            await updateTableLibraries(d._id, libraries)
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing _id or libraries")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
