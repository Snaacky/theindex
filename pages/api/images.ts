import { images } from '../../lib/icon'
import { getCache, setCache } from '../../lib/db/cache'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data = await getCache('images')
  if (data === null) {
    data = images()
    await setCache('images', data)
  }

  res.json((data as string[]).map((i) => i.replace('/img/', '')))
}
