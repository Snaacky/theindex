import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import DataBadge from '../../components/data/DataBadge'
import UserBoard from '../../components/boards/UserBoard'
import useSWR from 'swr'
import { getUsers } from '../../lib/db/users'

export default function Users({ users: staticUsers }) {
  let { data: users } = useSWR('/api/users')
  users = users || staticUsers

  return (
    <>
      <Head>
        <title>{'Users | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>

      <h2>
        <FontAwesomeIcon icon={['fas', 'users']} /> The whole community
        <div className={'float-end'} style={{ fontSize: '1.2rem' }}>
          <DataBadge
            name={users.length + ' user' + (users.length !== 1 ? 's' : '')}
            style={'primary'}
          />
        </div>
      </h2>
      <p>Listing of all registered users</p>

      <UserBoard users={users} allUsers={users} />
    </>
  )
}

Users.auth = {
  requireAdmin: true,
}

export async function getServerSideProps() {
  const users = await getUsers()
  return {
    props: {
      users,
    },
  }
}
