import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addTab, updateTab} from "../../../lib/db/tabs"

export default async function apiEditTab(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.urlId !== "" && d.title !== "") {
            if (d.urlId === "_new") {
                res.status(400).body("Illegal url id: '_new' is forbidden!")
            } else {
                if (typeof d._id === "undefined") {
                    await addTab(d.urlId, d.title, d.nsfw, d.description, d.tables)
                } else {
                    await updateTab(d._id, d.urlId, d.title, d.nsfw, d.description, d.tables)
                }
                res.status(200).body("Ok")
            }
        }
    } else {
        // Not Signed in
        res.status(401).body("Not logged in or edits are not permitted")
    }
    res.end()
}
