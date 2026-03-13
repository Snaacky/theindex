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
import type { User } from '../../types/User'
import type { List } from '../../types/List'
import type { Item } from '../../types/Item'
import type { Column } from '../../types/Column'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import AccountTypeBadge from '../../components/badge/AccountTypeBadge'
import {
  getAllUserIds,
  getColumnsForItems,
  getFollowedListsForUser,
  getItemsByIds,
  getListsForUser,
  getUserByUid,
} from '../../lib/db/publicData'

type Props = {
  user: User
  lists: List[]
  followLists: List[]
  items: Item[]
  columns: Column[]
}

const User: FC<Props> = ({ user, lists, followLists, items, columns }) => {
  const { data: session } = useSession()

  const userFav = user.favs
    .map((itemId) => items.find((item) => item._id === itemId))
    .filter((item): item is Item => typeof item !== 'undefined')

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
          onClick={async () => {
            console.log(
              'User data',
              await fetch('/api/user/' + user.uid).then((res) => res.json())
            )
          }}
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
          lists={lists}
          allLists={lists}
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
          allLists={followLists}
          updateURL={'/api/edit/user'}
        />
      ) : (
        <p className={'text-muted'}>User follows no other lists</p>
      )}
    </>
  )
}

export default User

export async function getStaticPaths() {
  const users = await getAllUserIds()

  return {
    paths: users.map((user) => ({
      params: {
        id: user.uid,
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const user = await getUserByUid(params.id)

  if (!user) {
    return {
      notFound: true,
    }
  }

  const [lists, followLists, items] = await Promise.all([
    getListsForUser(user.uid),
    getFollowedListsForUser(user),
    getItemsByIds(user.favs || []),
  ])

  return {
    props: {
      user,
      lists,
      followLists,
      items,
      columns: await getColumnsForItems(items),
    },
    revalidate: 60,
  }
}
