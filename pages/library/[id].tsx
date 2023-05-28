import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getLibraries } from '../../lib/db/libraries'
import { useSession } from 'next-auth/react'
import { canEdit, isEditor } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import CollectionBoard from '../../components/boards/CollectionBoard'
import { getByUrlId } from '../../lib/db/db'
import IconLibrary from '../../components/icons/IconLibrary'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconNSFW from '../../components/icons/IconNSFW'
import Meta from '../../components/layout/Meta'
import React, { FC, useState } from 'react'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import ItemBoard from '../../components/boards/ItemBoard'
import { Collection } from '../../types/Collection'
import { Library } from '../../types/Library'
import { Item } from '../../types/Item'
import { Column } from '../../types/Column'
import DeleteButton from '../../components/buttons/DeleteButton'

type Props = {
  library: Library
  collections: Collection[]
  items: Item[]
  columns: Column[]
}

const Library: FC<Props> = ({ library, collections, items, columns }) => {
  const { data: session } = useSession()
  const [showCollections, setShowCollections] = useState(false)

  const { data: swrLibrary } = useSWR('/api/library/' + library._id)
  library = swrLibrary || library
  const { data: swrCollections } = useSWR('/api/collections')
  collections = swrCollections || collections
  const libraryCollections = library.collections
    .map((collectionId) =>
      collections.find((collection) => collection._id === collectionId)
    )
    .filter((collection) => collection)
  const collectionsItems = [].concat.apply(
    [],
    libraryCollections.map((collection) => collection.items)
  )
  const { data: swrItems } = useSWR('/api/items')
  items = swrItems || items
  const hotFixLibraryItems = items.filter((i) =>
    collectionsItems.some((item) => i._id === item)
  )
  const { data: swrColumns } = useSWR('/api/columns')
  columns = swrColumns || columns

  return (
    <>
      <Head>
        <title>
          {library.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>

        <Meta
          title={library.name}
          description={library.description}
          image={process.env.NEXT_PUBLIC_DOMAIN + '/img/' + library.img}
        />
      </Head>

      <div className={'row'}>
        <div className={'col-auto'}>
          <div className={'d-absolute mb-2'}>
            <Image
              src={'/img/' + library.img}
              alt={'Image of collection'}
              width={148}
              height={148}
              className={'rounded-circle bg-6'}
            />
          </div>
        </div>
        <div className={'col'}>
          <div className={'row'}>
            <div className={'col'}>
              <h2>
                <IconLibrary /> {library.name}
                {canEdit(session) && (
                  <Link href={'/edit/library/' + library._id}>
                    <a data-tooltip-content={'Edit tab'} className={'ms-2'}>
                      <IconEdit />
                    </a>
                  </Link>
                )}
              </h2>
            </div>
            <div className={'col-12 col-md-auto mb-2'}>
              {library.nsfw && <IconNSFW />}
              {canEdit(session) && (
                <DeleteButton
                  type={Types.library}
                  content={library}
                  className={'ms-2'}
                />
              )}
              <span className={'ms-2'}>
                <ViewAllButton type={Types.library} />
              </span>
            </div>
          </div>

          <p
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            {library.description}
          </p>
        </div>
      </div>

      <h4 className={'mb-3'}>
        Show me all
        <div
          className='btn-group ms-2'
          role='group'
          aria-label='Toggle collection/item view'
        >
          <button
            type='button'
            className={
              'btn btn-' + (showCollections ? 'outline-' : '') + 'primary'
            }
            onClick={() => setShowCollections(false)}
          >
            Items
          </button>
          <button
            type='button'
            className={
              'btn btn-' + (!showCollections ? 'outline-' : '') + 'primary'
            }
            onClick={() => setShowCollections(true)}
          >
            Collections
          </button>
        </div>
      </h4>

      {showCollections ? (
        <CollectionBoard
          contentOf={library}
          collections={libraryCollections}
          allCollections={collections}
          canEdit={isEditor(session)}
        />
      ) : (
        <ItemBoard
          contentOf={library}
          items={hotFixLibraryItems}
          allItems={items}
          columns={columns}
          showSponsors={true}
          canEdit={isEditor(session)}
        />
      )}
    </>
  )
}

export default Library

export async function getStaticPaths() {
  const libraries = await getLibraries()
  const paths = libraries.map((library) => {
    return {
      params: {
        id: library.urlId,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const library = (await getByUrlId('libraries', params.id)) as Library
  if (!library) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: {
      library,
      collections: await getAllCache(Types.collection),
      items: await getAllCache(Types.item),
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
