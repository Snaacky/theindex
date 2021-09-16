import {getSession} from "next-auth/client"
import {canEdit} from "../../../lib/session"
import {deleteCollection} from "../../../lib/db/collections"
import {updateLibrary} from "../../../lib/db/libraries"
import {find} from "../../../lib/db/db"

export default async function apiDeleteCollection(req, res) {
    const session = await getSession({req})
    if (canEdit(session)) {
        const d = req.body
        if (d._id !== "") {
            await deleteCollection(d._id)
            // remove collection entry from libraries
            const librariesWithCollection = await find("libraries", {collections: [d._id]})
            await Promise.all(librariesWithCollection.map(
                async library => await updateLibrary(library._id, {
                    collections: library.collections.filter(t => t !== d._id)
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
