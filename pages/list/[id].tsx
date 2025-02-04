import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { canEdit, isAdmin, isCurrentUser } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import IconList from '../../components/icons/IconList'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import { getAllCache, getSingleCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import type { List } from '../../types/List'
import type { User } from '../../types/User'
import type { Item } from '../../types/Item'
import type { Column } from '../../types/Column'
import DeleteButton from '../../components/buttons/DeleteButton'

type Props = {
  list: List
  owner: User
  allItems: Item[]
  columns: Column[]
}

const List: FC<Props> = ({ list, owner, allItems, columns }) => {
  const { data: session } = useSession()

  const { data: swrList } = useSWR('/api/list/' + list._id, {
    fallbackData: list,
  })
  list = (swrList as List) || list
  const { data: swrOwner } = useSWR('/api/user/' + owner.uid, {
    fallbackData: owner,
  })
  owner = (swrOwner as User) || owner
  //let adminInfo
  if (isAdmin(session)) {
    //adminInfo = owner
    if ('user' in owner) {
      // @ts-ignore
      owner = owner.user
    }
  }

  const { data: swrItems } = useSWR('/api/items', {
    fallbackData: allItems,
  })
  allItems = (swrItems as Item[]) || allItems
  const { data: swrColumns } = useSWR('/api/columns', {
    fallbackData: columns,
  })
  columns = (swrColumns as Column[]) || columns

  const items = (list.items || [])
    .map((itemId) => allItems.find((item) => item._id === itemId))
    .filter((item) => typeof item !== 'undefined')

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
      />
    </>
  )
}

export default List

export async function getServerSideProps({ params }) {
  const list = (await getSingleCache(Types.list, params.id)) as List
  if (list === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      list,
      owner: await getSingleCache(Types.user, list.owner),
      allItems: await getAllCache(Types.item),
      columns: await getAllCache(Types.column),
    },
  }
}
