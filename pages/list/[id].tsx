import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { canEdit, isCurrentUser } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import IconList from '../../components/icons/IconList'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import { Types } from '../../types/Components'
import type { List } from '../../types/List'
import type { User } from '../../types/User'
import type { Item } from '../../types/Item'
import type { Column } from '../../types/Column'
import DeleteButton from '../../components/buttons/DeleteButton'
import {
  getAllListIds,
  getColumnsForItems,
  getItemsByIds,
  getListById,
  getUserByUid,
} from '../../lib/db/publicData'

type Props = {
  list: List
  owner: User
  allItems: Item[]
  columns: Column[]
}

const List: FC<Props> = ({ list, owner, allItems, columns }) => {
  const { data: session } = useSession()

  const items = (list.items || [])
    .map((itemId) => allItems.find((item) => item._id === itemId))
    .filter((item): item is Item => typeof item !== 'undefined')

  const title = owner.name + "'s list " + list.name
  return (
    <>
      <Head>
        <title>{list.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta
          title={title}
          description={list.description}
          image={owner.image}
        />
      </Head>

      <h2>
        <IconList /> {list.name}
        {canEdit(session) && (
          <Link
            href={'/edit/list/' + list._id}
            data-tooltip-content={'Edit list'}
            className={'ms-2'}
          >
            <IconEdit />
          </Link>
        )}
        <span style={{ fontSize: '1.2rem' }} className={'float-end'}>
          {list.nsfw && <IconNSFW />}
          {canEdit(session) && (
            <DeleteButton type={Types.list} content={list} className={'ms-2'} />
          )}
          <span className={'ms-2'}>
            <ViewAllButton type={Types.list} />
          </span>
        </span>
      </h2>
      <p
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {list.description}
      </p>
      <p>
        Made by
        <Link
          href={'/user/' + owner.uid}
          className={'ms-1'}
          data-tooltip-content={'View user ' + (owner.name ?? '')}
        >
          {owner.name ?? <code>Unable to get name</code>}
        </Link>
      </p>

      <ItemBoard
        contentOf={list}
        items={items}
        allItems={allItems}
        columns={columns}
        canMove={true}
        updateURL={'/api/edit/list'}
        canEdit={isCurrentUser(session, list.owner)}
        loadAllContentUrl={'/api/items'}
        deferAllContentLoad={true}
      />
    </>
  )
}

export default List

export async function getStaticPaths() {
  const lists = await getAllListIds()

  return {
    paths: lists.map((list) => ({
      params: {
        id: list._id,
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const list = await getListById(params.id)
  if (list === null) {
    return {
      notFound: true,
    }
  }

  const [owner, allItems] = await Promise.all([
    getUserByUid(list.owner),
    getItemsByIds(list.items || []),
  ])

  if (owner === null) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: {
      list,
      owner,
      allItems,
      columns: await getColumnsForItems(allItems),
    },
    revalidate: 60,
  }
}
