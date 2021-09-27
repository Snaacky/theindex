import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { getLastViews } from '../lib/db/views'
import ItemCard from '../components/cards/ItemCard'
import CollectionCard from '../components/cards/CollectionCard'
import ListCard from '../components/cards/ListCard'

const description =
  'The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps.'

export default function Home({
  trendingItem: staticTrendingItem,
  trendingCollection: staticTrendingCollection,
  trendingList: staticTrendingList,
}) {
  let { data: items } = useSWR('/api/popular/items')
  let { data: collections } = useSWR('/api/popular/collections')
  let { data: lists } = useSWR('/api/popular/lists')

  items = (items || staticTrendingItem).slice(0, 10)
  collections = (collections || staticTrendingCollection).slice(0, 10)
  lists = (lists || staticTrendingList).slice(0, 10)

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <meta property='og:title' content={process.env.NEXT_PUBLIC_SITE_NAME} />
        <meta
          name='twitter:title'
          content={process.env.NEXT_PUBLIC_SITE_NAME}
        />

        <meta name='description' content={description} />
        <meta property='og:description' content={description} />
        <meta name='twitter:description' content={description} />

        <meta
          name='twitter:image'
          content={process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png'}
        />
        <meta
          property='og:image'
          content={process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png'}
        />
      </Head>

      <div className={'row'}>
        <div className={'col'}>
          <h2 className={'mb-0'}>
            Currently popular <Link href={'/items'}>items</Link>
          </h2>
          <div className={'mb-3 text-muted'}>
            According to recent view counts
          </div>
        </div>

        <div className={'col-auto'}>
          <Link href={'/items'}>
            <a className={'btn btn-primary'}>View all</a>
          </Link>
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-4'}
        style={{ marginRight: '-0.5rem' }}
      >
        {items.map((item) => {
          return <ItemCard item={item} key={item._id} />
        })}
      </div>

      <div className={'row'}>
        <div className={'col'}>
          <h2 className={'mb-0'}>
            Currently popular <Link href={'/collections'}>collections</Link>
          </h2>
          <div className={'mb-3 text-muted'}>
            According to recent view counts
          </div>
        </div>

        <div className={'col-auto'}>
          <Link href={'/collections'}>
            <a className={'btn btn-primary'}>View all</a>
          </Link>
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-4'}
        style={{ marginRight: '-0.5rem' }}
      >
        {collections.map((collection) => {
          return <CollectionCard collection={collection} key={collection._id} />
        })}
      </div>

      <div className={'row'}>
        <div className={'col'}>
          <h2 className={'mb-0'}>
            Currently popular <Link href={'/lists'}>lists</Link>
          </h2>
          <div className={'mb-3 text-muted'}>
            According to recent view counts
          </div>
        </div>

        <div className={'col-auto'}>
          <Link href={'/lists'}>
            <a className={'btn btn-primary'}>View all</a>
          </Link>
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-4'}
        style={{ marginRight: '-0.5rem' }}
      >
        {lists.map((list) => {
          return <ListCard list={list} key={list._id} />
        })}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const trendingItem = await getLastViews('item', 100)
  const trendingCollection = await getLastViews('collection', 100)
  const trendingList = await getLastViews('list', 100)
  return {
    props: {
      trendingItem,
      trendingCollection,
      trendingList,
    },
    revalidate: 30,
  }
}
