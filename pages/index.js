import Head from 'next/head'
import Link from 'next/link'
import { getLastViews } from '../lib/db/views'
import ItemCard from '../components/cards/ItemCard'
import CollectionCard from '../components/cards/CollectionCard'
import ListCard from '../components/cards/ListCard'
import LibraryCard from '../components/cards/LibraryCard'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import ViewAllButton from '../components/buttons/ViewAllButton'

const description =
  'The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps.'

export default function Home({
  libraries,
  items,
  collections,
  lists,
  sponsors,
  columns,
}) {
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
          <ViewAllButton type={Types.library} />
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

      {sponsors.length > 0 && (
        <>
          <h2>Sponsored items</h2>
          <div
            className={'d-flex flex-wrap mb-4'}
            style={{ marginRight: '-0.5rem' }}
          >
            {sponsors.map((item) => {
              return <ItemCard item={item} columns={columns} key={item._id} />
            })}
          </div>
        </>
      )}

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
          <ViewAllButton type={Types.item} />
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-4'}
        style={{ marginRight: '-0.5rem' }}
      >
        {items.map((item) => {
          return <ItemCard item={item} columns={columns} key={item._id} />
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
          <ViewAllButton type={Types.collection} />
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
          <ViewAllButton type={Types.list} />
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
      items: (await getLastViews('item', 1000))
        .filter((item) => !item.sponsor)
        .slice(0, 9),
      collections: (await getLastViews('collection', 1000)).slice(0, 9),
      lists: (await getLastViews('list', 1000)).slice(0, 9),
      sponsors: (await getAllCache(Types.item)).filter((item) => item.sponsor),
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
