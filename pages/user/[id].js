import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/client'
import { isAdmin, isCurrentUser } from '../../lib/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DataBadge from '../../components/data/DataBadge'
import { getUser } from '../../lib/db/users'
import ListBoard from '../../components/boards/ListBoard'
import ItemBoard from '../../components/boards/ItemBoard'
import Meta from '../../components/layout/Meta'
import React from 'react'
import useSWR from 'swr'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'

export default function User({ user, lists, items }) {
  const [session] = useSession()

  const { data: swrUser } = useSWR('/api/user/' + user.uid)
  user = swrUser || user
  const { data: swrItem } = useSWR('/api/items')
  items = swrItem || items
  const userFav = user.favs.map((itemId) =>
    items.find((item) => item._id === itemId)
  )
  const { data: swrLists } = useSWR('/api/lists')
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
                  <DataBadge name={user.accountType} style={'primary'} />
                  <div className={'float-end'}>
                    {(isAdmin(session) || isCurrentUser(session, user.uid)) && (
                      <Link href={'/edit/user/' + user.uid}>
                        <a title={'Edit user'} className={'ms-2'}>
                          <FontAwesomeIcon icon={['fas', 'cog']} />
                        </a>
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
          _id={user.uid}
          items={userFav}
          allItems={items}
          canEdit={false}
          updateURL={'/api/edit/user'}
          updateKey={'favs'}
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
          uid={user.uid}
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
          uid={user.uid}
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

export async function getServerSideProps({ params }) {
  const user = await getUser(params.id)
  const lists = await getAllCache(Types.list)

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
      lists,
      items: await getAllCache(Types.item),
    },
  }
}
