import {fetchSite} from "./browser"
import {addItemScreenshot} from "../db/itemScreenshots"

export default async function createScreenshot(item) {
    if (item.urls.length > 0) {
        const {screenshotStream} = await fetchSite(item.urls[0], item._id)
        if (screenshotStream !== null) {
            await addItemScreenshot(screenshotStream, item._id)
        }
    } else {
        console.warn("Item has no url to take a screenshot from")
    }
}
