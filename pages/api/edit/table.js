import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addTable, updateTable} from "../../../lib/db/tables"

export default async function apiEditTable(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.urlId !== "" && d.name !== "") {
            if (d.urlId === "_new") {
                res.status(400).send("Illegal url id: '_new' is forbidden!")
            } else {
                if (typeof d._id === "undefined") {
                    await addTable(d.urlId, d.name, d.nsfw, d.description, d.items)
                } else {
                    await updateTable(d._id, d.urlId, d.name, d.nsfw, d.description, d.items)
                }
                res.status(200).send("Ok")
            }
        } else {
            res.status(400).send("Missing url id or name")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
