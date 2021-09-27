import Head from 'next/head'
import React from 'react'
import IconCollection from '../components/icons/IconCollection'
import CollectionBoard from '../components/boards/CollectionBoard'
import useSWR from 'swr'
import { getCollections, updateCollection } from '../lib/db/collections'
import { getItem } from '../lib/db/items'

const title = 'Collections on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Collections are like a curated table listing various items. Every entry is done by hand from the editor-team'

export default function Collections({ collections: staticCollections }) {
  let { data: collections } = useSWR('/api/collections')
  collections = collections || staticCollections

  return (
    <>
      <Head>
        <title>
          {'All collections | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>

        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />

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

      <h2>
        <IconCollection /> All collections
      </h2>
      <p>{description}</p>

      <CollectionBoard
        collections={collections}
        updateURL={''}
        deleteURL={'/api/delete/collection'}
        canEdit={true}
      />
    </>
  )
}

export async function getStaticProps() {
  const collections = await getCollections()

  // TODO: remove cleanup code, should be handled by db
  collections.forEach((collection) => {
    collection.items.forEach((itemId) => {
      getItem(itemId).then((item) => {
        if (typeof item === 'undefined' || item === null) {
          updateCollection(collection._id, {
            items: collection.items.filter((i) => i !== itemId),
          })
        }
      })
    })
  })

  return {
    props: {
      collections,
    },
    revalidate: 30,
  }
}
