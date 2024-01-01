import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { isAdmin, isCurrentUser } from '../../lib/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DataBadge from '../../components/data/DataBadge'
import ListBoard from '../../components/boards/ListBoard'
import ItemBoard from '../../components/boards/ItemBoard'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import useSWR from 'swr'
import { getAllCache, getSingleCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import type { User } from '../../types/User'
import type { List } from '../../types/List'
import type { Item } from '../../types/Item'
import type { Column } from '../../types/Column'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import AccountTypeBadge from '../../components/badge/AccountTypeBadge'

type Props = {
  user: User
  lists: List[]
  items: Item[]
  columns: Column[]
}

const User: FC<Props> = ({ user, lists, items, columns }) => {
  const { data: session } = useSession()

  const { data: swrUser } = useSWR('/api/user/' + user.uid, {
    fallbackData: user,
  })
  user = swrUser || user
  let adminInfo
  if (isAdmin(session)) {
    adminInfo = user
    if ('user' in user) {
      // @ts-ignore
      user = user.user
    }
  }

  const { data: swrColumn } = useSWR('/api/columns', {
    fallbackData: columns,
  })
  columns = swrColumn || columns
  const { data: swrItem } = useSWR('/api/items', {
    fallbackData: items,
  })
  items = swrItem || items
  const userFav = user.favs.map((itemId) =>
    items.find((item) => item._id === itemId)
  )
  const { data: swrLists } = useSWR('/api/lists', {
    fallbackData: lists,
  })
  lists = swrLists || lists
  const userLists = lists.filter((list) => list.owner === user.uid)
  const followLists = (swrLists || lists).filter((list) =>
    user.followLists.includes(list._id)
  )

  return (
    <>
      <Head>
        <title>
          {'User ' + user.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
        <meta name='robots' content='noindex, archive, follow' />

        <Meta
          title={'User ' + user.name}
          description={user.description}
          image={user.image}
        />
      </Head>

      <div className={'card bg-2'}>
        <div className='card-body pb-0'>
          <div className={'card-title row'}>
            <div
              className={'col-auto'}
              style={{
                height: '40px',
                overflow: 'show',
              }}
            >
              <Image
                className={'rounded'}
                alt={'Profile picture of ' + user.name}
                width={64}
                height={64}
                src={user.image}
              />
            </div>
            <div className={'col'}>
              <h3>
                {user.name}
                <span className={'ms-2'} style={{ fontSize: '1.2rem' }}>
                  <AccountTypeBadge type={user.accountType} />

                  <div className={'float-end'}>
                    {(isAdmin(session) || isCurrentUser(session, user.uid)) && (
                      <Link
                        href={'/edit/user/' + user.uid}
                        title={'Edit user'}
                        className={'ms-2'}
                      >
                        <FontAwesomeIcon icon={faCog} />
                      </Link>
                    )}
                  </div>
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div className={'card-body bg-4'}>
          <p
            className={'card-text'}
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            {user.description || (
              <span className={'text-muted'}>It seems quite empty here</span>
            )}
          </p>
        </div>
      </div>

      {isAdmin(session) && (
        <button
          className={'mt-3 btn btn-warning'}
          onClick={() => console.log('User data', adminInfo)}
        >
          Print user infos to console
        </button>
      )}

      <h3 className={'mt-3'}>
        Starred items
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={
              user.favs.length + ' item' + (user.favs.length !== 1 ? 's' : '')
            }
            style={'primary'}
          />
        </div>
      </h3>
      {user.favs.length > 0 ? (
        <ItemBoard
          contentOf={user}
          items={userFav}
          allItems={items}
          canEdit={false}
          updateURL={'/api/edit/user'}
          updateKey={'favs'}
          columns={columns}
        />
      ) : (
        <p className={'text-muted'}>No starred items found</p>
      )}

      <h3 className={'mt-3'}>
        Lists
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={lists.length + ' list' + (lists.length !== 1 ? 's' : '')}
            style={'primary'}
          />
        </div>
      </h3>
      {lists.length > 0 || isCurrentUser(session, user.uid) ? (
        <ListBoard
          contentOf={user}
          lists={userLists}
          allLists={userLists}
          canEdit={isCurrentUser(session, user.uid) || isAdmin(session)}
          updateURL={'/api/edit/user'}
        />
      ) : (
        <p className={'text-muted'}>No user lists found</p>
      )}

      <h3 className={'mt-3'}>
        Followed lists
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={
              followLists.length +
              ' list' +
              (followLists.length !== 1 ? 's' : '')
            }
            style={'primary'}
          />
        </div>
      </h3>
      {followLists.length > 0 ? (
        <ListBoard
          contentOf={user}
          lists={followLists}
          allLists={lists}
          updateURL={'/api/edit/user'}
        />
      ) : (
        <p className={'text-muted'}>User follows no other lists</p>
      )}
    </>
  )
}

export default User

export async function getServerSideProps({ params }) {
  const user = await getSingleCache(Types.user, params.id) as User

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
      lists: await getAllCache(Types.list),
      items: await getAllCache(Types.item),
      columns: await getAllCache(Types.column),
    },
  }
}
