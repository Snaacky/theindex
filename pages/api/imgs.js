import { images } from '../../lib/icon'

export default async function handler(req, res) {
  res.status(200).json(images().map((i) => i.replace('/img/', '')))
}
