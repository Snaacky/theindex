import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addColumn, updateColumn} from "../../../lib/db/columns"

export default async function apiEditColumn(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.urlId !== "" && d.title !== "") {
            if (d.urlId === "_new") {
                res.status(400).send("Illegal url id: '_new' is forbidden!")
            } else {
                if (typeof d._id === "undefined") {
                    await addColumn(d.urlId, d.title, d.nsfw, d.description, d.type, d.values)
                } else {
                    await updateColumn(d._id, d.urlId, d.title, d.nsfw, d.description, d.type, d.values)
                }
                res.status(200).send("Ok")
            }
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
