import {getUserWithLists} from "../../../lib/db/users"
import {getSession} from "next-auth/client"

export default async function handler(req, res) {
    let result = {}
    if (req.query.id === "me") {
        const session = await getSession({req})
        result = await getUserWithLists(session.user.uid)
    } else {
        result = await getUserWithLists(req.query.id)
    }
    res.status(200).json(result)
}
