import Head from 'next/head'
import React from 'react'
import IconCollection from '../components/icons/IconCollection'
import CollectionBoard from '../components/boards/CollectionBoard'
import useSWR from 'swr'
import { getCollections, updateCollection } from '../lib/db/collections'
import { getItem } from '../lib/db/items'
import Meta from "../components/layout/Meta";

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

        <Meta title={title} description={description} />
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
