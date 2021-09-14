import {getItem} from "../../../../lib/db/items"
import {getSession} from "next-auth/client"
import {getItemScreenshotBuffer, screenshotExists} from "../../../../lib/db/itemScreenshots"
import createScreenshot from "../../../../lib/crawler/screenshot"
import {isAdmin} from "../../../../lib/session"
import fs from "fs"

export default async function handler(req, res) {
    const session = await getSession({req})
    const item = await getItem(req.query.id)
    if (item) {
        try {
            if (await screenshotExists(item._id)) {
                const screenshotBuffer = await getItemScreenshotBuffer(item._id)
                if (screenshotBuffer !== null) {
                    res.setHeader("Content-Type", "image/png")
                    res.send(screenshotBuffer)
                } else {
                    res.status(500).send("Something went wrong here.. no image stream found")
                }
            } else {
                if (isAdmin(session)) {
                    console.log("Admin and missing screenshot, creating new")
                    createScreenshot(item._id).then(() => console.log("Screenshot", item._id, "created"))
                }
                fs.createReadStream("public/no-screenshot.png").pipe(res)
            }
        } catch (e) {
            console.log("Something horribly went wrong :(", e)
            res.status(500).send(e.toString())
        }
    } else {
        res.status(404).end()
    }
}
