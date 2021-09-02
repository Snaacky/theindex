import {getSession} from "next-auth/client"
import {canEdit} from "../../../../lib/session"
import {updateTab} from "../../../../lib/db/tabs"

export default async function apiEditTabOrder(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (Array.isArray(d.tabs)) {
            await Promise.all(
                d.tabs.map(
                    async (t, i) => await updateTab(typeof t === "string" ? t : t._id, {order: i})
                )
            )

            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing tabs")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
