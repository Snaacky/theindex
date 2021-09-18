import {getSession} from "next-auth/client"
import {canEdit} from "../../../../lib/session"
import {updateItemCollections} from "../../../../lib/db/items"

export default async function apiEditColumnCollections(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (typeof d._id !== "undefined" && Array.isArray(d.collections)) {
            const collections = d.collections.map(t => typeof t === "string" ? t : t._id)
            await updateItemCollections(d._id, collections)
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing _id or collections")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
