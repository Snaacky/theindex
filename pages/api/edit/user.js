import {getSession} from "next-auth/client"
import {isAdmin, isCurrentUser} from "../../../lib/session"
import {updateUser} from "../../../lib/db/users"

export default async function apiEditUser(req, res) {
    const session = await getSession({req})
    if (isAdmin(session) || isCurrentUser(session)) {
        const d = req.body
        if (d.uid !== "") {
            if (!isAdmin(session) && d.accountType) {
                delete d.accountType
            }
            await updateUser(d.uid, d)
            res.status(200).send("Ok")
        } else {
            res.status(400).send("Missing uid")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
