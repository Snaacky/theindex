import puppeteer from 'puppeteer-core'

export async function fetchSite(url: string, itemId?: string) {
  if (!process.env.CHROME_URL) {
    throw Error('No ws url for chromium defined')
  }

  const browser = await puppeteer
    .connect({
      browserWSEndpoint: process.env.CHROME_URL,
    })
    .catch((e) => {
      console.error('Failed to connect to chrome instance for', url, e)
    })

  if (!browser) {
    return null
  }

  // open a new empty tab and set viewport
  const page = await browser.newPage().catch((e) => {
    console.error('Failed to open a new page in chrome instance for', url, e)
  })
  if (!page) {
    await browser.close()
    return null
  }
  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  })

  console.log('Fetching site', url, 'of item', itemId)
  // go to page and wait till idle
  const response = await page
    .goto(url, {
      waitUntil: 'networkidle2',
    })
    .catch((e) => {
      console.error('Could not navigate to page', url, e)
    })
  if (!response) {
    await page.close()
    await browser.close()
    return null
  }

  console.log('Waiting for 10s timeout for', url)
  // solve cf or ddos-guard JS-challenge
  // captcha is still going to bite us
  await new Promise((r) => setTimeout(r, 10000))

  // collect data from fully rendered site
  const content = await page.content()
  const status = response.status()
  let screenshotStream: Uint8Array | null = null
  if (itemId) {
    try {
      screenshotStream = await page.screenshot({
        captureBeyondViewport: false,
      })
    } catch (e) {
      console.error('Could not create screenshot stream', e)
    }
  }

  // cleanup
  page.removeAllListeners('request')
  await page.close()
  await browser.close()

  return {
    status,
    screenshotStream,
    content,
  }
}
