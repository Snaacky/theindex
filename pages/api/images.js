import { images } from '../../lib/icon'
import { getCache, setCache } from '../../lib/db/cache'

export default async function handler(req, res) {
  let data = await getCache('images')
  if (data === null) {
    data = images()
    await setCache('images', data)
  }

  res.status(200).json(data.map((i) => i.replace('/img/', '')))
}
