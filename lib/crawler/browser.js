import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import AdblockPlugin from "puppeteer-extra-plugin-adblocker"

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockPlugin())

export async function fetchSite(url, itemId = null) {
    console.log("Fetching site", url, "of item", itemId)
    const browser = await puppeteer.launch({

        args: [
            // we do not have a gpu available in docker, fallback to cpu rendering
            "--disable-gpu",
            // use /tmp rather than RAM
            "--disable-dev-shm-usage",
            // prevent privilege escapes as docker runs as root
            "--disable-setuid-sandbox",
            "--no-sandbox"
        ]
    })
    try {
        // open a new empty tab and set viewport
        const page = await browser.newPage()
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 1
        })

        // go to page and wait till idle
        const response = await page.goto(url, {
            waitUntil: "networkidle0"
        })
        
        // solve cf or ddos-guard JS-challenge
        // captcha is still going to bite us
        await page.waitForTimeout(8000)

        // collect data from fully rendered site
        const content = await page.content()
        const status = response.status()
        let screenshotStream = null
        if (itemId) {
            try {
                screenshotStream = await page.screenshot()
            } catch (e) {
                console.error("Could not create screenshot stream", e)
            }
        }
        page.removeAllListeners("request")
        await page.close()

        return {
            status,
            screenshotStream,
            content
        }
    } catch (e) {
        console.error("Oh no something went wrong while trying to get page data", e)
    } finally {
        await browser.close()
    }
}
