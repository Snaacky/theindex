import Head from 'next/head'
import IconLibrary from '../components/icons/IconLibrary'
import React from 'react'
import LibraryBoard from '../components/boards/LibraryBoard'
import useSWR from 'swr'
import { getLibraries } from '../lib/db/libraries'
import Meta from '../components/layout/Meta'

const title = 'Libraries on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  "Libraries are over-categories of a bunch of collections that fit into it's category"

export default function Libraries({ libraries: staticLibraries }) {
  let { data: libraries } = useSWR('/api/libraries')
  libraries = libraries || staticLibraries

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
  const libraries = await getLibraries()
  return {
    props: {
      libraries,
    },
    revalidate: 600,
  }
}
