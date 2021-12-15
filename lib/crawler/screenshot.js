import { fetchSite } from './browser'
import { addItemScreenshot } from '../db/itemScreenshots'
import { getItem } from '../db/items'

export default async function createScreenshot(_id) {
  const item = await getItem(_id)
  console.log('Taking screenshot of item', _id)
  if (item.urls.length > 0) {
    try {
      const { screenshotStream } = await fetchSite(item.urls[0], item._id)
      if (screenshotStream !== null) {
        await addItemScreenshot(screenshotStream, item._id)
        console.log('Created screenshot of item', _id)
      }
    } catch (e) {
      console.error('Failed to create screenshot of', _id, e)
    }
  } else {
    console.warn('Item', _id, 'has no url to take a screenshot from')
  }
}
