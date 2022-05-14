import puppeteer from 'puppeteer-core'

if (!process.env.CHROME_URL) {
  throw Error('No ws url for chromium defined')
}

const browser = puppeteer.connect({
  browserWSEndpoint: process.env.CHROME_URL,
})

export async function fetchSite(url: string, itemId?: string) {
  console.log('Fetching site', url, 'of item', itemId)

  // open a new empty tab and set viewport
  const page = await (await browser).newPage()
  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  })

  let response = null
  try {
    // go to page and wait till idle
    response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 6000,
    })
  } catch (e) {
    console.error('Could not navigate to page', url, e)
    await page.close()
    return null
  }

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
      console.error('Could not create screenshot stream', e)
    }
  }

  // cleanup
  page.removeAllListeners('request')
  await page.close()

  return {
    status,
    screenshotStream,
    content,
  }
}
