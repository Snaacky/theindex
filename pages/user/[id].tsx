import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { isAdmin, isCurrentUser } from '../../lib/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import type { User } from '../../types/User'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import AccountTypeBadge from '../../components/badge/AccountTypeBadge'
import { getAllUserIds, getUserByUid } from '../../lib/db/publicData'

type Props = {
  user: User
}

const User: FC<Props> = ({ user }) => {
  const { data: session } = useSession()

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

  return {
    props: {
      user,
    },
    revalidate: 600,
  }
}
