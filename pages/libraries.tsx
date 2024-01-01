import Head from 'next/head'
import IconLibrary from '../components/icons/IconLibrary'
import React, { FC } from 'react'
import LibraryBoard from '../components/boards/LibraryBoard'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'
import type { Library } from '../types/Library'

const title = 'Libraries on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  "Libraries are over-categories of a bunch of collections that fit into it's category"

type Props = {
  libraries: Library[]
}

const Libraries: FC<Props> = ({ libraries }) => {
  const { data: swrLibraries } = useSWR('/api/libraries', {
    fallbackData: libraries,
  })
  libraries = swrLibraries || libraries

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

      <LibraryBoard
        contentOf={null}
        libraries={libraries}
        allLibraries={libraries}
        canEdit={true}
      />
    </>
  )
}

export default Libraries

export async function getStaticProps() {
  return {
    props: {
      libraries: await getAllCache(Types.library),
    },
    revalidate: 60,
  }
}
