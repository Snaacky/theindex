import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import EditUser from '../../../components/edit/EditUser'
import NotAdmin from '../../../components/layout/NotAdmin'
import ViewAllButton from '../../../components/buttons/ViewAllButton'
import { Types } from '../../../types/Components'
import { findOneTyped } from '../../../lib/db/dbTyped'
import type { User } from '../../../types/User'

export default function EditorUser({ uid, user }) {
  const { data: session } = useSession()

  if (!isCurrentUser(session, uid) && !isAdmin(session)) {
    return <NotAdmin />
  }

  return (
    <>
      <Head>
        <title>
          {'Edit user ' + user.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
      </Head>

      <div className={'d-flex flex-row'}>
        <div className={'flex-grow-1'}>
          <h2>
            Edit user <Link href={'/user/' + uid}>{user.name}</Link>
          </h2>
          <small className={'text-muted'}>
            ID: <code>{uid}</code>
          </small>
        </div>
        {isAdmin(session) && (
          <div>
            <ViewAllButton type={Types.user} />
          </div>
        )}
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          <EditUser
            adminEditing={isAdmin(session)}
            uid={uid}
            accountType={user.accountType}
            description={user.description}
          />
        </div>
      </div>
    </>
  )
}

EditorUser.auth = {}

export async function getServerSideProps({ params }) {
  const user = (await findOneTyped(Types.user, params.id)) as User
  if (!user) {
    return {
      notFound: true,
    }
  }

  user.uid = user.uid.toString()
  return {
    props: {
      uid: params.id,
      user,
    },
  }
}
