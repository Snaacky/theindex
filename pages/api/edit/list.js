import {getSession} from "next-auth/client"
import {isAdmin, isCurrentUser, isLogin} from "../../../lib/session"
import {addList, getList, updateList} from "../../../lib/db/lists"

export default async function apiEditList(req, res) {
    const session = await getSession({req})
    const d = req.body
    if (isLogin(session)) {
        if (typeof d._id === "undefined" && (isCurrentUser(session, d.owner) || isAdmin(session))) {
            if (d.owner !== "" && d.name !== "") {
                await addList(d.owner, d.name, d.nsfw, d.description, d.columns)
                res.status(200).send("Ok")
            } else {
                res.status(400).send("Missing owner or name")
            }
        } else {
            const list = await getList(d._id)
            if (isCurrentUser(session, list.owner) || isAdmin(session)) {
                await updateList(d._id, d)
                res.status(200).send("Ok")
            } else {
                res.status(401).send("Not logged in or edits are not permitted")
            }
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
