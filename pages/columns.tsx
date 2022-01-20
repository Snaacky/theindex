import Head from 'next/head'
import React, { FC } from 'react'
import IconColumn from '../components/icons/IconColumn'
import ColumnBoard from '../components/boards/ColumnBoard'
import DataBadge from '../components/data/DataBadge'
import Meta from '../components/layout/Meta'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import useSWR from 'swr'
import { Column } from '../types/Column'

const title = 'All columns on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Items can have different data-fields for different attributes. We call such fields columns like you use to in a table'

type Props = {
  columns: Column[]
}

const Columns: FC<Props> = ({ columns }) => {
  const { data: swrColumns } = useSWR('/api/columns')
  columns = swrColumns || columns

  return (
    <>
      <Head>
        <title>{'All columns | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta title={title} description={description} />
      </Head>

      <h2>
        <IconColumn /> All columns
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={
              columns.length + ' column' + (columns.length !== 1 ? 's' : '')
            }
            style={'primary'}
          />
        </div>
      </h2>
      <p>{description}</p>

      <ColumnBoard
        contentOf={null}
        columns={columns}
        allColumns={columns}
        updateURL={''}
        deleteURL={'/api/delete/column'}
        canEdit={true}
      />
    </>
  )
}

export default Columns

export async function getStaticProps() {
  return {
    props: {
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
