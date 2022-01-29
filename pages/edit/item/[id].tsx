import Head from 'next/head'
import Link from 'next/link'
import { getItem } from '../../../lib/db/items'
import { getColumns } from '../../../lib/db/columns'
import EditItem from '../../../components/edit/EditItem'
import CollectionBoard from '../../../components/boards/CollectionBoard'
import { getCollections } from '../../../lib/db/collections'
import ViewAllButton from '../../../components/buttons/ViewAllButton'
import { Types } from '../../../types/Components'

export default function EditorItem({ _id, collections, columns, item }) {
  let collectionsWithItem = []
  if (_id !== '_new') {
    collectionsWithItem = collections.filter((t) =>
      t.items.some((i) => i === item._id)
    )
  }

  return (
    <>
      <Head>
        <title>
          {(_id === '_new' ? 'Create item' : 'Edit item ' + item.name) +
            ' | ' +
            process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
      </Head>

      <div className={'d-flex flex-row'}>
        <div className={'flex-grow-1'}>
          <h2>
            {_id === '_new' ? (
              'Create a new item'
            ) : (
              <>
                Edit item <Link href={'/item/' + item._id}>{item.name}</Link>
              </>
            )}
          </h2>
          {_id !== '_new' && (
            <small className={'text-muted'}>
              ID: <code>{item._id}</code>
            </small>
          )}
        </div>
        <div>
          <ViewAllButton type={Types.item} />
        </div>
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          {_id === '_new' ? (
            <EditItem columns={columns} />
          ) : (
            <EditItem
              _id={item._id}
              name={item.name}
              urls={item.urls}
              nsfw={item.nsfw}
              sponsor={item.sponsor}
              blacklist={item.blacklist}
              description={item.description}
              data={item.data}
              columns={columns}
            />
          )}
        </div>
      </div>

      <h4>Collections with this item</h4>
      {_id !== '_new' ? (
        <CollectionBoard
          contentOf={item}
          collections={collectionsWithItem}
          allCollections={collections}
          canMove={false}
          canEdit={true}
          forceEditMode={true}
          updateURL={'/api/edit/item/collections'}
        />
      ) : (
        <div className={'text-muted'}>
          Collection selection will be available once the library has been
          created
        </div>
      )}
    </>
  )
}

EditorItem.auth = {
  requireEditor: true,
}

export async function getServerSideProps({ params }) {
  let item = {}
  if (params.id !== '_new') {
    item = await getItem(params.id)
    if (!item) {
      return {
        notFound: true,
      }
    }
  }

  return {
    props: {
      _id: params.id,
      collections: await getCollections(),
      columns: await getColumns(),
      item,
    },
  }
}
