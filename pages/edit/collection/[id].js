import Head from 'next/head'
import { getLibrariesWithCollections } from '../../../lib/db/libraries'
import { getCollection, getCollections } from '../../../lib/db/collections'
import Link from 'next/link'
import EditCollection from '../../../components/edit/EditCollection'
import LibraryBoard from '../../../components/boards/LibraryBoard'
import ViewAllButton from '../../../components/buttons/ViewAllButton'

export default function EditorCollection({
  _id,
  libraries,
  collections,
  collection,
}) {
  let librariesWithCollection = []
  if (_id !== '_new') {
    librariesWithCollection = libraries.filter((t) =>
      t.collections.some((c) => c._id === collection._id)
    )
  }

  return (
    <>
      <Head>
        <title>
          {(_id === '_new'
            ? 'Create collection'
            : 'Edit collection ' + collection.name) +
            ' | ' +
            process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
      </Head>

      <div className={'d-flex flex-row'}>
        <div className={'flex-grow-1'}>
          <h2>
            {_id === '_new' ? (
              'Create a new collection'
            ) : (
              <>
                Edit collection{' '}
                <Link href={'/collection/' + collection.urlId}>
                  {collection.name}
                </Link>
              </>
            )}
          </h2>
          {_id !== '_new' && (
            <small className={'text-muted'}>
              ID: <code>{collection._id}</code>
            </small>
          )}
        </div>
        <div>
          <ViewAllButton type={'collections'} />
        </div>
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          {_id === '_new' ? (
            <EditCollection collections={collections} />
          ) : (
            <EditCollection
              collections={collections}
              _id={collection._id}
              urlId={collection.urlId}
              img={collection.img}
              name={collection.name}
              nsfw={collection.nsfw}
              description={collection.description}
            />
          )}
        </div>
      </div>

      <h4>Libraries with this collection</h4>
      {_id !== '_new' ? (
        <LibraryBoard
          _id={collection._id}
          libraries={librariesWithCollection}
          allLibraries={libraries}
          canMove={false}
          canEdit={true}
          updateURL={'/api/edit/collection/libraries'}
          deleteURL={''}
          forceEditMode={true}
        />
      ) : (
        <div className={'text-muted'}>
          Library selection will be available once the collection has been
          created
        </div>
      )}
    </>
  )
}

EditorCollection.auth = {
  requireEditor: true,
}

export async function getServerSideProps({ params }) {
  let collection = {}
  if (params.id !== '_new') {
    collection = await getCollection(params.id)
    if (!collection) {
      return {
        notFound: true,
      }
    }
  }

  return {
    props: {
      _id: params.id,
      libraries: await getLibrariesWithCollections(),
      collections: await getCollections(),
      collection,
    },
  }
}
