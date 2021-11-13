import Head from 'next/head'
import IconLibrary from '../components/icons/IconLibrary'
import React from 'react'
import LibraryBoard from '../components/boards/LibraryBoard'
import { getLibraries } from '../lib/db/libraries'
import Meta from '../components/layout/Meta'
import { getCache, setCache } from '../lib/db/cache'

const title = 'Libraries on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  "Libraries are over-categories of a bunch of collections that fit into it's category"

export default function Libraries({ libraries }) {
  return (
    <>
      <Head>
        <title>{'All libraries | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta title={title} description={description} />
      </Head>

      <h2>
        <IconLibrary /> All libraries
      </h2>
      <p>{description}</p>

      <LibraryBoard libraries={libraries} canEdit={true} />
    </>
  )
}

export async function getStaticProps() {
  const key = 'libraries'
  let cache = await getCache(key)
  if (cache === null) {
    cache = {
      libraries: await getLibraries(),
    }
    setCache(key, cache).then(() => {
      console.info('Created cache for', key)
    })
  }

  return {
    props: cache,
    revalidate: 60,
  }
}
