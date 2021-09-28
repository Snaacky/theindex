import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { canEdit, isCurrentUser } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import useSWR from 'swr'
import { getList, getLists } from '../../lib/db/lists'
import { getUser } from '../../lib/db/users'
import IconList from '../../components/icons/IconList'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import IconDelete from '../../components/icons/IconDelete'
import { postData } from '../../lib/utils'

export default function List({
  _id,
  list: staticList,
  owner: staticOwner,
  ownerUid,
}) {
  const [session] = useSession()
  let { data: list } = useSWR('/api/list/' + _id)
  let { data: owner } = useSWR('/api/user/' + ownerUid)

  list = list || staticList
  owner = owner || staticOwner

  const title =
    owner.name +
    "'s list " +
    list.name +
    ' on ' +
    process.env.NEXT_PUBLIC_SITE_NAME
  return (
    <>
      <Head>
        <title>{list.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>

        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />

        <meta name='description' content={list.description} />
        <meta property='og:description' content={list.description} />
        <meta name='twitter:description' content={list.description} />

        <meta name='twitter:image' content={owner.image} />
        <meta property='og:image' content={owner.image} />
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

export async function getStaticPaths() {
  const lists = await getLists()
  const paths = lists.map((list) => {
    return {
      params: {
        id: list._id,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const list = await getList(params.id)
  if (!list) {
    return {
      notFound: true,
      revalidate: 30,
    }
  }
  const owner = await getUser(list.owner)

  return {
    props: {
      _id: list._id,
      list,
      owner,
      ownerUid: owner.uid,
    },
    revalidate: 30,
  }
}
