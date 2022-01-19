import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import { Library } from '../types/Library'
import { Item } from '../types/Item'
import process from 'process'
import { Collection } from '../types/Collection'
import { List } from '../types/List'

const Sitemap = () => {}

export const getServerSideProps = async ({ res }) => {
  const uri =
    'NEXT_PUBLIC_DOMAIN' in process.env
      ? process.env.NEXT_PUBLIC_DOMAIN
      : 'https://piracy.moe'
  let sitemap =
    uri +
    '\n' +
    uri +
    '/libraries\n' +
    uri +
    '/collections\n' +
    uri +
    '/items\n' +
    uri +
    '/lists\n'

  const libraries = (await getAllCache(Types.library)) as Library[]
  sitemap += libraries
    .map((library) => uri + '/library/' + library.urlId + '\n')
    .join('')

  const collections = (await getAllCache(Types.collection)) as Collection[]
  sitemap += collections
    .map((collection) => uri + '/collection/' + collection.urlId + '\n')
    .join('')

  const items = (await getAllCache(Types.item)) as Item[]
  sitemap += items.map((item) => uri + '/item/' + item._id + '\n').join('')

  const lists = (await getAllCache(Types.list)) as List[]
  sitemap += lists.map((list) => uri + '/list/' + list._id + '\n').join('')

  res.setHeader('Content-Type', 'text/plain')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
