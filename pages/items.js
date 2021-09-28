import Head from 'next/head'
import React from 'react'
import IconItem from '../components/icons/IconItem'
import ItemBoard from '../components/boards/ItemBoard'
import useSWR from 'swr'
import { getItems } from '../lib/db/items'
import DataBadge from '../components/data/DataBadge'

const title = 'Items on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Every item represents a service and contains various information like which languages it supports or feature it has'

export default function Items({ items: staticItems }) {
  let { data: items } = useSWR('/api/items')
  items = items || staticItems

  return (
    <>
      <Head>
        <title>{'All items | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

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
        <IconItem /> All items
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={items.length + ' item' + (items.length !== 1 ? 's' : '')}
            style={'primary'}
          />
        </div>
      </h2>
      <p>{description}</p>

      <ItemBoard items={items} deleteURL={'/api/delete/item'} canEdit={true} />
    </>
  )
}

export async function getStaticProps() {
  const items = await getItems()
  return {
    props: {
      items,
    },
    revalidate: 30,
  }
}
