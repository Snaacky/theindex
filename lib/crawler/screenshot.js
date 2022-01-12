import { fetchSite } from './browser'
import { addItemScreenshot } from '../db/itemScreenshots'
import { getItem } from '../db/items'

export default async function createScreenshot(_id) {
  const item = await getItem(_id)
  console.log('Taking screenshot of item', _id)
  if (item.urls.length > 0) {
    try {
      const result = await fetchSite(item.urls[0], item._id)
      const { screenshotStream } = result

      if (screenshotStream !== null && typeof screenshotStream !== 'undefined') {
        await addItemScreenshot(screenshotStream, item._id)
        console.log('Created screenshot of item', _id)
        return true
      }
    } catch (e) {
      console.error('Failed to create screenshot of', _id, e)
    }
  } else {
    console.warn('Item', _id, 'has no url to take a screenshot from')
  }
  return false
}
