import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {deleteTable} from "../../../lib/db/tables"
import {updateTab} from "../../../lib/db/tabs"
import {find} from "../../../lib/db/db"

export default async function apiDeleteTab(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d._id !== "") {
            await deleteTable(d._id)
            // remove table entry from tabs
            const tabsWithTable = await find("tabs", {tables: [d._id]})
            await Promise.all(tabsWithTable.map(
                async tab => await updateTab(tab._id, {
                    tables: tab.tables.filter(t => t !== d._id)
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
