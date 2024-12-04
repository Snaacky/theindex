import Head from 'next/head'
import {
  getLibrariesWithCollections,
  getLibrary,
} from '../../../lib/db/libraries'
import { getCollections } from '../../../lib/db/collections'
import EditLibrary from '../../../components/edit/EditLibrary'
import Link from 'next/link'
import CollectionBoard from '../../../components/boards/CollectionBoard'
import ViewAllButton from '../../../components/buttons/ViewAllButton'
import { Types } from '../../../types/Components'
import DeleteButton from '../../../components/buttons/DeleteButton'
import React from 'react'
import { Library } from '../../../types/Library'

export default function EditorLibrary({
  _id,
  libraries,
  collections,
  library,
}) {
  return (
    <>
      <Head>
        <title>
          {(_id === '_new' ? 'Create tab' : 'Edit library' + library.name) +
            ' | ' +
            process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
      </Head>

      <div className={'d-flex flex-row'}>
        <div className={'flex-grow-1'}>
          <h2>
            {_id === '_new' ? (
              'Create a new library'
            ) : (
              <>
                Edit library{' '}
                <Link href={'/library/' + library.urlId}>{library.name}</Link>
              </>
            )}
          </h2>
          {_id !== '_new' && (
            <small className={'text-muted'}>
              ID: <code>{library._id}</code>
            </small>
          )}
        </div>
        <div>
          <DeleteButton
            type={Types.library}
            content={library}
            className={'me-2'}
          />
          <ViewAllButton type={Types.library} />
        </div>
      </div>

      <div className={'card bg-2 mb-3'}>
        <div className='card-body'>
          {_id === '_new' ? (
            <EditLibrary libraries={libraries} />
          ) : (
            <EditLibrary
              libraries={libraries}
              _id={library._id}
              urlId={library.urlId}
              name={library.name}
              img={library.img}
              nsfw={library.nsfw}
              description={library.description}
              collections={library.collections.map((c) =>
                collections.find((collection) => collection._id === c)
              )}
            />
          )}
        </div>
      </div>

      <h4>Collections used in this library</h4>
      {_id !== '_new' ? (
        <CollectionBoard
          contentOf={library}
          collections={library.collections.map((c) =>
            collections.find((collection) => collection._id === c)
          )}
          allCollections={collections}
          canMove={false}
          canEdit={true}
          forceEditMode={true}
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

EditorLibrary.auth = {
  requireEditor: true,
}

export async function getServerSideProps({ params }) {
  let library: Library | null = null
  if (params.id !== '_new') {
    library = await getLibrary(params.id)
    if (library === null) {
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
      library,
    },
  }
}
