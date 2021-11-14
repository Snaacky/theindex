import Head from 'next/head'
import React from 'react'
import IconItem from '../components/icons/IconItem'
import ItemBoard from '../components/boards/ItemBoard'
import DataBadge from '../components/data/DataBadge'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'

const title = 'Items on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Every item represents a service and contains various information like which languages it supports or feature it has'

export default function Items({ items }) {
  const { data: swrItems } = useSWR('/api/items')
  items = swrItems || items

  return (
    <>
      <Head>
        <title>{'All items | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta title={title} description={description} />
      </Head>

      <h2>
        <IconItem /> All items
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={items.length + ' item' + (items.length !== 1 ? 's' : '')}
            style={'primary'}
          />
        </div>
      </h2>
      <p>{description}</p>

      <ItemBoard
        items={items}
        deleteURL={'/api/delete/item'}
        canEdit={true}
        showSponsors={true}
      />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      items: await getAllCache(Types.item),
    },
    revalidate: 60,
  }
}
