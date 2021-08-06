import {getSession} from 'next-auth/client'
import {canEdit} from "../../../lib/session";
import {addTab, updateTab} from "../../../lib/db/tabs";

export default async (req, res) => {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d.url_id !== "" && d.title !== "") {
            if (d.url_id === "_new") {
                res.status(400).body("Illegal url id: '_new' is forbidden!")
            } else {
                if (d._id === undefined) {
                    await addTab(d.url_id, d.title, d.nsfw, d.description, d.tables)
                } else {
                    await updateTab(d._id, d.url_id, d.title, d.nsfw, d.description, d.tables)
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
