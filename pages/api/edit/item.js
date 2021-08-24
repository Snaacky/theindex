import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addItem, updateItem} from "../../../lib/db/items"

export default async function apiEditItem(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.title !== "") {
            if (typeof d._id === "undefined") {
                await addItem(d.title, d.urls, d.nsfw, d.description, d.blacklist, d.sponsor, d.data)
            } else {
                await updateItem(d._id, d.title, d.urls, d.nsfw, d.description, d.blacklist, d.sponsor, d.data)
            }
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing url id or title")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
