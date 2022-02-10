import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getList } from '../../../lib/db/lists'
import EditList from '../../../components/edit/EditList'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import NotAdmin from '../../../components/layout/NotAdmin'
import ViewAllButton from '../../../components/buttons/ViewAllButton'
import { Types } from '../../../types/Components'
import DeleteButton from '../../../components/buttons/DeleteButton'
import React from 'react'

export default function EditorList({ _id, userLists, list }) {
  const { data: session } = useSession()

  if (_id !== '_new') {
    if (!isCurrentUser(session, list.owner) && !isAdmin(session)) {
      return <NotAdmin />
    }
  }

  return (
    <>
      <Head>
        <title>
          {(_id === '_new' ? 'Create list' : 'Edit list ' + list.name) +
            ' | ' +
            process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
      </Head>

      <div className={'d-flex flex-row'}>
        <div className={'flex-grow-1'}>
          <h2>
            {_id === '_new' ? (
              'Create a new list'
            ) : (
              <>
                Edit list <Link href={'/list/' + list._id}>{list.name}</Link>
              </>
            )}
          </h2>
          {_id !== '_new' && (
            <small className={'text-muted'}>
              ID: <code>{list._id}</code>
            </small>
          )}
        </div>
        <div className={'d-flex flex-row'}>
          <DeleteButton type={Types.list} content={list} className={'me-2'} />
          <ViewAllButton type={Types.list} />
        </div>
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          {_id === '_new' ? (
            <EditList
              lists={userLists}
              owner={(session.user as { uid: string }).uid}
            />
          ) : (
            <EditList
              _id={list._id}
              name={list.name}
              nsfw={list.nsfw}
              description={list.description}
              lists={userLists}
              owner={list.owner}
            />
          )}
        </div>
      </div>
    </>
  )
}

EditorList.auth = {
  requireLogin: true,
}

export async function getServerSideProps({ params }) {
  let list = {}
  if (params.id !== '_new') {
    list = await getList(params.id)
    if (!list) {
      return {
        notFound: true,
      }
    }
  }

  return {
    props: {
      _id: params.id,
      list,
      userLists: [], // await getUserWithLists(list.owner).lists
    },
  }
}
