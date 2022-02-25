import Head from 'next/head'
import Link from 'next/link'
import { getLastViews } from '../lib/db/views'
import ItemCard from '../components/cards/ItemCard'
import CollectionCard from '../components/cards/CollectionCard'
import LibraryCard from '../components/cards/LibraryCard'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import ViewAllButton from '../components/buttons/ViewAllButton'
import { Item } from '../types/Item'

const description =
  'The best places to stream your favorite anime shows online or download them for free and watch in sub or dub. Supports manga, light novels, hentai, and apps.'

export default function Home({ libraries, items, collections, columns }) {
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
    </>
  )
}

export async function getStaticProps() {
  const allItems = (await getAllCache(Types.item)) as Item[]
  const sponsors = allItems.filter((item) => item.sponsor)
  let popular = (await getLastViews(Types.item, 1000)) as Item[]

  const sponsorsSortedByPopular = sponsors.sort((a, b) => {
    const popularA = popular.findIndex((item) => item._id === a._id)
    const popularB = popular.findIndex((item) => item._id === b._id)
    console.log(
      'Comparing Items for sorting popularity:',
      a.name,
      popularA,
      b.name,
      popularB
    )

    // desc popularity
    if (popularA !== popularB) {
      if (popularA === -1) {
        return 1
      } else if (popularB === -1) {
        return -1
      }
      return popularA < popularB ? -1 : 1
    }

    // asc name
    return a.name < b.name ? -1 : 1
  })

  // remove all sponsor from popular
  popular = popular.filter((item) => !item.sponsor)
  // and re-add them by sorted sponsor array
  sponsorsSortedByPopular.reverse().forEach((sponsor) => {
    popular.unshift(sponsor)
  })

  return {
    props: {
      libraries: (await getLastViews(Types.library, 1000)).slice(0, 6),
      items: popular.slice(0, 9),
      collections: (await getLastViews(Types.collection, 1000)).slice(0, 9),
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
