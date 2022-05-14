import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { canEdit, isAdmin, isCurrentUser } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import { getList } from '../../lib/db/lists'
import IconList from '../../components/icons/IconList'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import { getAllCache, getSingleCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import { List } from '../../types/List'
import { User } from '../../types/User'
import { Item } from '../../types/Item'
import { Column } from '../../types/Column'
import DeleteButton from '../../components/buttons/DeleteButton'

type Props = {
  list: List
  owner: User
  allItems: Item[]
  columns: Column[]
}

const List: FC<Props> = ({ list, owner, allItems, columns }) => {
  const { data: session } = useSession()

  const { data: swrList } = useSWR('/api/list/' + list._id)
  list = swrList || list
  const { data: swrOwner } = useSWR('/api/user/' + owner.uid)
  owner = swrOwner || owner
  let adminInfo
  if (isAdmin(session)) {
    adminInfo = owner
    if ('user' in owner) {
      // @ts-ignore
      owner = owner.user
    }
  }
  
  const { data: swrItems } = useSWR('/api/items')
  allItems = swrItems || allItems
  const { data: swrColumns } = useSWR('/api/columns')
  columns = swrColumns || columns

  const items = list.items.map((itemId) =>
    allItems.find((item) => item._id === itemId)
  )

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
          <Link href={'/edit/list/' + list._id}>
            <a data-tip={'Edit list'} className={'ms-2'}>
              <IconEdit />
            </a>
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
        <Link href={'/user/' + owner.uid}>
          <a className={'ms-1'} data-tip={'View user ' + (owner.name ?? '')}>
            {owner.name ?? <code>Unable to get name</code>}
          </a>
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
  const list = await getList(params.id)
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
