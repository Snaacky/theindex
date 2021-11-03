import Head from 'next/head'
import React from 'react'
import IconColumn from '../components/icons/IconColumn'
import ColumnBoard from '../components/boards/ColumnBoard'
import useSWR from 'swr'
import { getColumns } from '../lib/db/columns'
import DataBadge from '../components/data/DataBadge'
import Meta from "../components/layout/Meta";

const title = 'All columns on ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Items can have different data-fields for different attributes. We call such fields columns like you use to in a table'

export default function Columns({ columns: staticColumns }) {
  let { data: columns } = useSWR('/api/columns')
  columns = columns || staticColumns

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
        columns={columns}
        updateURL={''}
        deleteURL={'/api/delete/column'}
        canEdit={true}
      />
    </>
  )
}

export async function getStaticProps() {
  const columns = await getColumns()
  return {
    props: {
      columns,
    },
    revalidate: 30,
  }
}
