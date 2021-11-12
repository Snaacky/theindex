import Head from 'next/head'
import React from 'react'
import { getLists } from '../lib/db/lists'
import ListBoard from '../components/boards/ListBoard'
import IconList from '../components/icons/IconList'
import Meta from '../components/layout/Meta'

const title = 'All user lists on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'User lists are created collections with user selected items, ranking and columns to display'

export default function Lists({ lists }) {
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
      lists: await getLists(),
    },
    revalidate: 120,
  }
}
