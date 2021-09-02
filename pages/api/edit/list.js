import {getSession} from "next-auth/client"
import {isAdmin, isCurrentUser, isLogin} from "../../../lib/session"
import {addList, updateList} from "../../../lib/db/lists"

export default async function apiEditList(req, res) {
    const session = await getSession({req})
    const d = req.body
    if (isLogin(session)) {
        if (d.owner !== "" && d.name !== "") {
            if (typeof d._id === "undefined" && (isCurrentUser(session, d.owner) || isAdmin(session))) {
                await addList(d.owner, d.name, d.nsfw, d.description, d.columns)
                res.status(200).send("Ok")
            } else if (isCurrentUser(session, d.owner) || isAdmin(session)) {
                await updateList(d._id, d)
                res.status(200).send("Ok")
            } else {
                res.status(401).send("Not logged in or edits are not permitted")
            }
        } else {
            res.status(400).send("Missing owner or name")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
