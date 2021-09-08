import {getUserWithLists} from "../../../lib/db/users"
import {getSession} from "next-auth/client"
import {isLogin} from "../../../lib/session"

export default async function handler(req, res) {
    let result = {}
    if (req.query.id === "me") {
        const session = await getSession({req})
        if (isLogin(session)) {
            result = await getUserWithLists(session.user.uid)
        } else {
            return res.status(401).json({})
        }
    } else {
        result = await getUserWithLists(req.query.id)
    }
    res.status(200).json(result)
}
