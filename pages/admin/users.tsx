import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import DataBadge from '../../components/data/DataBadge'
import UserBoard from '../../components/boards/UserBoard'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import { User } from '../../types/User'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'

const Users = ({ users }: { users: User[] }) => {
  const { data: swrUsers } = useSWR('/api/users', {
    fallbackData: users,
  })
  users = swrUsers || users

  return (
    <>
      <Head>
        <title>{'Users | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>

      <h2>
        <FontAwesomeIcon icon={faUsers} /> The whole community
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={users.length + ' user' + (users.length !== 1 ? 's' : '')}
            style={'primary'}
          />
        </div>
      </h2>
      <p>Listing of all registered users</p>

      <UserBoard users={users} allUsers={users} contentOf={null} />
    </>
  )
}

Users.auth = {
  requireAdmin: true,
}

export default Users

export async function getServerSideProps() {
  return {
    props: {
      users: await getAllCache(Types.user),
    },
  }
}
