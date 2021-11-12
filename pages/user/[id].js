import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/client'
import { isAdmin, isCurrentUser } from '../../lib/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DataBadge from '../../components/data/DataBadge'
import { getUserWithLists } from '../../lib/db/users'
import ListBoard from '../../components/boards/ListBoard'
import ItemBoard from '../../components/boards/ItemBoard'
import Meta from '../../components/layout/Meta'
import React from 'react'

export default function User({ uid, user }) {
  const [session] = useSession()

  return (
    <>
      <Head>
        <title>
          {'User ' + name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
        <meta name='robots' content='noindex, archive, follow' />

        <Meta
          title={'User ' + name}
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
                alt={'Profile picture of ' + name}
                width={64}
                height={64}
                src={user.image}
              />
            </div>
            <div className={'col'}>
              <h3>
                {name}
                <span className={'ms-2'} style={{ fontSize: '1.2rem' }}>
                  <DataBadge name={user.accountType} style={'primary'} />
                  <div className={'float-end'}>
                    {isAdmin(session) || isCurrentUser(session, uid) ? (
                      <Link href={'/edit/user/' + uid}>
                        <a title={'Edit user'} className={'ms-2'}>
                          <FontAwesomeIcon icon={['fas', 'cog']} />
                        </a>
                      </Link>
                    ) : (
                      <></>
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
          _id={uid}
          items={user.favs}
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
            name={
              user.lists.length + ' list' + (user.lists.length !== 1 ? 's' : '')
            }
            style={'primary'}
          />
        </div>
      </h3>
      {user.lists.length > 0 || isCurrentUser(session, uid) ? (
        <ListBoard
          uid={uid}
          lists={user.lists}
          canEdit={isCurrentUser(session, uid) || isAdmin(session)}
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
              user.followLists.length +
              ' list' +
              (user.followLists.length !== 1 ? 's' : '')
            }
            style={'primary'}
          />
        </div>
      </h3>
      {user.followLists.length > 0 ? (
        <ListBoard
          uid={uid}
          lists={user.followLists}
          updateURL={'/api/edit/user'}
        />
      ) : (
        <p className={'text-muted'}>User follows no other lists</p>
      )}
    </>
  )
}

export async function getServerSideProps({ params }) {
  const user = await getUserWithLists(params.id)
  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      uid: params.id,
      user,
    },
  }
}
