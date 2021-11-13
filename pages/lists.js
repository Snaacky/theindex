import Head from 'next/head'
import React from 'react'
import ListBoard from '../components/boards/ListBoard'
import IconList from '../components/icons/IconList'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'

const title = 'All user lists on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'User lists are created collections with user selected items, ranking and columns to display'

export default function Lists({ lists }) {
  const { data: swrLists } = useSWR('/api/lists/')
  lists = swrLists || lists

  return (
    <>
      <Head>
        <title>{'All user lists | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <Meta title={title} description={description} />
      </Head>

      <h2>
        <IconList /> All user lists
      </h2>
      <p>{description}</p>

      <ListBoard lists={lists} />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      lists: await getAllCache(Types.list),
    },
    revalidate: 60,
  }
}
