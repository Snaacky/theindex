import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { canEdit } from '../../lib/session'
import { getByUrlId } from '../../lib/db/db'
import { getColumns } from '../../lib/db/columns'
import ItemCard from '../../components/cards/ItemCard'
import IconEdit from '../../components/icons/IconEdit'
import React, { useState } from 'react'
import DataItem from '../../components/data/DataItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import { getItems } from '../../lib/db/items'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconColumn from '../../components/icons/IconColumn'
import IconNSFW from '../../components/icons/IconNSFW'
import IconDelete from '../../components/icons/IconDelete'
import { postData } from '../../lib/utils'
import Meta from "../../components/layout/Meta";

export default function Column({
  _id,
  column: staticColumn,
  columns: staticColumns,
  items: staticItems,
}) {
  const [session] = useSession()
  const [filter, setFilter] = useState(null)
  let { data: column } = useSWR('/api/column/' + _id)
  let { data: columns } = useSWR('/api/columns')
  let { data: items } = useSWR('/api/items')

  column = column || staticColumn
  columns = columns || staticColumns
  items = items || staticItems

  const itemsContainingColumn = items.filter((i) =>
    Object.keys(i.data).includes(column._id)
  )

  const filteredItems = itemsContainingColumn.filter((i) => {
    if (filter === null) {
      return true
    }

    if (column.type === 'array') {
      return (
        filter.length === 0 ||
        filter.every((ii) => i.data[column._id].includes(ii))
      )
    } else if (column.type === 'bool') {
      return i.data[column._id] === filter
    }
    return (
      filter === '' ||
      i.data[column._id].toLowerCase().includes(filter.toLowerCase())
    )
  })

  const title =
    'Column ' + column.name + ' on ' + process.env.NEXT_PUBLIC_SITE_NAME
  return (
    <>
      <Head>
        <title>{column.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta title={title} description={column.description}/>
      </Head>

      <div className={'row'}>
        <div className={'col'}>
          <h2>
            <IconColumn /> {column.name}
            {canEdit(session) ? (
              <Link href={'/edit/column/' + column._id}>
                <a className={'ms-2'} title={'Edit column'}>
                  <IconEdit />
                </a>
              </Link>
            ) : (
              ''
            )}
          </h2>
        </div>
        <div className={'mb-2 col-auto'}>
          {column.nsfw ? <IconNSFW /> : <></>}
          {canEdit(session) && (
            <IconDelete
              className={'ms-2'}
              title={'Delete column'}
              onClick={() => {
                if (
                  confirm(
                    'Do you really want to delete the column "' +
                      column.name +
                      '"?'
                  )
                ) {
                  postData('/api/delete/column', { _id: column._id }, () => {
                    window.location.href = escape('/columns')
                  })
                }
              }}
            />
          )}
          <span className={'ms-2'}>
            <ViewAllButton type={'columns'} />
          </span>
        </div>
      </div>
      <p
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {column.description}
      </p>
      <div className={'card bg-2'}>
        <div className='card-body'>
          <div>
            <span className={'me-2'}>
              <FontAwesomeIcon icon={['fas', 'filter']} /> Filter:
            </span>
            {column.type === 'array' || column.type === 'bool' ? (
              <DataItem
                data={filter}
                column={column}
                name={column.name}
                onChange={setFilter}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div
        className={'d-flex flex-wrap mt-2'}
        style={{ marginRight: '-0.5rem' }}
      >
        {filteredItems.length === 0 ? (
          <span className={'text-muted'}>No items found</span>
        ) : (
          <></>
        )}
        {filteredItems.map((i) => {
          return <ItemCard item={i} columns={columns} key={i._id} />
        })}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const columns = await getColumns()
  const paths = columns.map((i) => {
    return {
      params: {
        id: i.urlId,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const column = await getByUrlId('columns', params.id)
  if (!column) {
    return {
      notFound: true,
      revalidate: 30,
    }
  }

  const columns = await getColumns()
  const items = await getItems()
  return {
    props: {
      _id: column._id,
      column,
      columns,
      items,
    },
    revalidate: 30,
  }
}
