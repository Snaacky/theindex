import { fetchSite } from './browser'
import { addItemScreenshot } from '../db/itemScreenshots'
import { getItem } from '../db/items'

export default async function createScreenshot(_id: string) {
  const item = await getItem(_id)
  console.log('Taking screenshot of item', _id)
  if (item !== null && item.urls.length > 0) {
    try {
      const result = await fetchSite(item.urls[0], item._id)

      if (result !== null && result.screenshotStream !== null) {
        await addItemScreenshot(result.screenshotStream, item._id)
        console.log('Created screenshot of item', _id)
        return true
      }
    } catch {
      console.error('Failed to create screenshot of', _id)
    }
  } else {
    console.warn('Item', _id, 'has no url to take a screenshot from')
  }
  return false
}
