import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {addLibrary, updateLibrary} from "../../../lib/db/libraries"

export default async function apiEditLibrary(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.urlId !== "" && d.name !== "") {
            if (d.urlId === "_new") {
                res.status(400).send("Illegal url id: '_new' is forbidden!")
            } else {
                if (typeof d._id === "undefined") {
                    await addLibrary(d.urlId, d.img, d.name, d.nsfw, d.description, d.collections)
                } else {
                    await updateLibrary(d._id, d)
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
