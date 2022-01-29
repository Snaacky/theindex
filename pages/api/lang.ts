import { iso6393 } from 'iso-639-3'
import { getLanguages } from '../../lib/utils'

export default async function lang(req, res) {
  res.json({ filtered: getLanguages(), iso6393 })
}
