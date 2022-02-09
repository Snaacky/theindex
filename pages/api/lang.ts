import { iso6393 } from 'iso-639-3'
import { getLanguages } from '../../lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function apiLang(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({ filtered: getLanguages(), iso6393 })
}
