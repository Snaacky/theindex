import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { canEdit, isCurrentUser } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import { getList } from '../../lib/db/lists'
import IconList from '../../components/icons/IconList'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import IconDelete from '../../components/icons/IconDelete'
import { postData } from '../../lib/utils'
import Meta from '../../components/layout/Meta'
import React from 'react'
import { getSingleCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'

export default function List({ list, owner }) {
  const [session] = useSession()

  const { data: swrList } = useSWR('/api/list/' + list._id)
  list = swrList || list
  const { data: swrOwner } = useSWR('/api/user/' + owner._id)
  owner = swrOwner || owner

  const title = owner.name + "'s list " + list.name
  return (
    <>
      <Head>
        <title>{list.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <Meta
          title={title}
          description={list.description}
          image={owner.image}
        />
      </Head>

      <h2>
        <IconList /> {list.name}
        {canEdit(session) ? (
          <Link href={'/edit/list/' + list._id}>
            <a title={'Edit list'} className={'ms-2'}>
              <IconEdit />
            </a>
          </Link>
        ) : (
          <></>
        )}
        <span style={{ fontSize: '1.2rem' }} className={'float-end'}>
          {list.nsfw && <IconNSFW />}
          {canEdit(session) && (
            <IconDelete
              className={'ms-2'}
              title={'Delete list'}
              onClick={() => {
                if (
                  confirm(
                    'Do you really want to delete the list "' + list.name + '"?'
                  )
                ) {
                  postData('/api/delete/list', { _id: list._id }, () => {
                    window.location.href = escape('/lists')
                  })
                }
              }}
            />
          )}
          <span className={'ms-2'}>
            <ViewAllButton type={'lists'} />
          </span>
        </span>
      </h2>
      <p
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {list.description}
      </p>
      <p>
        Made by
        <Link href={'/user/' + owner.uid}>
          <a className={'ms-1'}>{owner.name}</a>
        </Link>
      </p>

      <ItemBoard
        _id={list._id}
        items={list.items}
        columns={list.columns}
        key={list._id}
        canMove={true}
        updateURL={'/api/edit/list'}
        canEdit={isCurrentUser(session, list.owner)}
      />
    </>
  )
}

export async function getServerSideProps({ params }) {
  const list = await getList(params.id)
  if (list === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      list,
      owner: await getSingleCache(Types.user, list.owner),
    },
  }
}
