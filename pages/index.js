import Head from 'next/head'
import Link from 'next/link'
import { getLastViews } from '../lib/db/views'
import ItemCard from '../components/cards/ItemCard'
import CollectionCard from '../components/cards/CollectionCard'
import ListCard from '../components/cards/ListCard'
import LibraryCard from '../components/cards/LibraryCard'
import Meta from '../components/layout/Meta'

const description =
  'The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps.'

export default function Home({ libraries, items, collections, lists }) {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta
          title={process.env.NEXT_PUBLIC_SITE_NAME}
          description={description}
        />
      </Head>

      <div className={'row'}>
        <div className={'col'}>
          <h2 className={'mb-0'}>
            Currently popular <Link href={'/libraries'}>libraries</Link>
          </h2>
          <div className={'mb-3 text-muted'}>
            According to recent view counts
          </div>
        </div>

        <div className={'col-auto'}>
          <Link href={'/libraries'}>
            <a className={'btn btn-primary'}>View all</a>
          </Link>
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-4'}
        style={{ marginRight: '-0.5rem' }}
      >
        {libraries.map((library) => {
          return <LibraryCard library={library} key={library._id} />
        })}
      </div>

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
  return {
    props: {
      libraries: (await getLastViews('library', 1000)).slice(0, 6),
      items: (await getLastViews('item', 1000)).slice(0, 9),
      collections: (await getLastViews('collection', 1000)).slice(0, 9),
      lists: (await getLastViews('list', 1000)).slice(0, 9),
    },
    revalidate: 20,
  }
}
