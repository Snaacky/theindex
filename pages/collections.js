import Head from 'next/head'
import React from 'react'
import IconCollection from '../components/icons/IconCollection'
import CollectionBoard from '../components/boards/CollectionBoard'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'

const title = 'Collections on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Collections are like a curated table listing various items. Every entry is done by hand from the editor-team'

export default function Collections({ collections }) {
  const { data: swrCollections } = useSWR('/api/collections')
  collections = swrCollections || collections

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
  return {
    props: {
      collections: await getAllCache(Types.collection),
    },
    revalidate: 60,
  }
}
