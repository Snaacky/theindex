import {getTabs} from "../../lib/db/tabs"

export default function handler(req, res) {
    res.status(200).json(getTabs())
}
