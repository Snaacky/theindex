import {getSession} from "next-auth/client"
import {isAdmin, isCurrentUser} from "../../../lib/session"
import {find} from "../../../lib/db/db"
import {deleteList, getList} from "../../../lib/db/lists"
import {updateUser} from "../../../lib/db/users"

export default async function apiDeleteList(req, res) {
    const session = await getSession({req})
    const d = req.body
    const list = await getList(d._id)
    if (isCurrentUser(session, list.owner) || isAdmin(session)) {
        if (d._id !== "") {
            await deleteList(d._id)
            // remove list entry from user.followLists
            const usersWithList = await find("users", {followLists: [d._id]})
            await Promise.all(usersWithList.map(
                async u => await updateUser(u._id, {
                    followLists: u.followLists.filter(t => t !== d._id)
                })
            ))
            res.status(200).send("Deleted")
        } else {
            res.status(400).send("Missing _id")
        }
    } else {
        // Not Signed in
        res.status(401).send("Not logged in or edits are not permitted")
    }
    res.end()
}
