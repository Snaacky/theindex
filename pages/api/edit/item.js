import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addItem, updateItem} from "../../../lib/db/items"
import createScreenshot from "../../../lib/crawler/screenshot"

export default async function apiEditItem(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (typeof d._id === "undefined") {
            const id = await addItem(d.name, d.urls, d.nsfw, d.description, d.blacklist, d.sponsor, d.data)
            createScreenshot(id).then(() => console.log("Screenshot", id, "created"))
        } else {
            await updateItem(d._id, d)
            createScreenshot(d._id).then(() => console.log("Screenshot", d._id, "created"))
        }
        res.status(200).send("Ok")
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
