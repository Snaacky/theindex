import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'
import { getLists } from '../lib/db/lists'
import ListBoard from '../components/boards/ListBoard'
import IconList from '../components/icons/IconList'
import Meta from '../components/layout/Meta'

const title = 'All user lists on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'User lists are created collections with user selected items, ranking and columns to display'

export default function Lists({ lists: staticLists }) {
  let { data: lists } = useSWR('/api/lists')
  lists = lists || staticLists

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
  const lists = await getLists()
  return {
    props: {
      lists,
    },
    revalidate: 600,
  }
}
