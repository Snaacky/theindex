import Head from 'next/head'
import Link from 'next/link'
import { getColumns } from '../../../lib/db/columns'
import { useSession } from 'next-auth/client'
import ColumnBoard from '../../../components/boards/ColumnBoard'
import { getList } from '../../../lib/db/lists'
import EditList from '../../../components/edit/EditList'
import { isAdmin, isCurrentUser } from '../../../lib/session'
import NotAdmin from '../../../components/layout/NotAdmin'
import ViewAllButton from '../../../components/buttons/ViewAllButton'

export default function EditorList({ _id, userLists, columns, list }) {
  const [session] = useSession()

  if (_id !== '_new') {
    list.columns = list.columns.map((c) => columns.find((t) => t._id === c))

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
        <div>
          <ViewAllButton type={'lists'} />
        </div>
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          {_id === '_new' ? (
            <EditList lists={userLists} owner={session.user.uid} />
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

      <h4>Columns used in this list</h4>
      {_id !== '_new' ? (
        <ColumnBoard
          _id={list._id}
          columns={list.columns}
          allColumns={columns}
          updateURL={'/api/edit/list'}
          canMove={false}
          canEdit={true}
          forceEditMode={true}
        />
      ) : (
        <div className={'text-muted'}>
          Column selection will be available once the list has been created
        </div>
      )}
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
      columns: await getColumns(),
      list,
      userLists: [], // await getUserWithLists(list.owner).lists
    },
  }
}
