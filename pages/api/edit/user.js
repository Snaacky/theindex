import {getSession} from "next-auth/client"
import {isAdmin} from "../../../lib/session"
import {updateUser} from "../../../lib/db/users"

export default async function apiEditUser(req, res) {
    const session = await getSession({req})
    if (isAdmin(session)) {
        const d = req.body
        if (d.uid !== "" && d.accountType !== "") {
            await updateUser({
                uid: d.uid,
                accountType: d.accountType,
                description: d.description
            })
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
