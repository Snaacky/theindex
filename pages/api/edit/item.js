import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addItem, updateItem} from "../../../lib/db/items"

export default async function apiEditItem(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.name !== "") {
            if (typeof d._id === "undefined") {
                await addItem(d.name, d.urls, d.nsfw, d.description, d.blacklist, d.sponsor, d.data)
            } else {
                await updateItem(d._id, d.name, d.urls, d.nsfw, d.description, d.blacklist, d.sponsor, d.data)
            }
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing url id or name")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}