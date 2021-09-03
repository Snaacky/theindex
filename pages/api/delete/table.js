import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {deleteTable} from "../../../lib/db/tables"
import {updateLibrary} from "../../../lib/db/libraries"
import {find} from "../../../lib/db/db"

export default async function apiDeleteTab(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d._id !== "") {
            await deleteTable(d._id)
            // remove table entry from libraries
            const librariesWithTable = await find("libraries", {tables: [d._id]})
            await Promise.all(librariesWithTable.map(
                async library=> await updateLibrary(library._id, {
                    tables: library.tables.filter(t => t !== d._id)
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
