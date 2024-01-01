import Head from 'next/head'
import React, { FC } from 'react'
import IconItem from '../components/icons/IconItem'
import ItemBoard from '../components/boards/ItemBoard'
import DataBadge from '../components/data/DataBadge'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'
import type { Item } from '../types/Item'
import type { Column } from '../types/Column'

const title = 'Items on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Every item represents a service and contains various information like which languages it supports or feature it has'

type Props = {
  items: Item[]
  columns: Column[]
}

const Items: FC<Props> = ({ items, columns }) => {
  const { data: swrItems } = useSWR('/api/items')
  items = swrItems || items
  const { data: swrColumns } = useSWR('/api/columns')
  columns = swrColumns || columns

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
        contentOf={null}
        items={items}
        allItems={items}
        columns={columns}
        deleteURL={'/api/delete/item'}
        canEdit={true}
        showSponsors={true}
      />
    </>
  )
}

export default Items

export async function getStaticProps() {
  return {
    props: {
      items: await getAllCache(Types.item),
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
