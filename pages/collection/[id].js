import { getCollections } from '../../lib/db/collections'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/client'
import { canEdit } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import { getByUrlId } from '../../lib/db/db'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconCollection from '../../components/icons/IconCollection'
import IconNSFW from '../../components/icons/IconNSFW'
import { postData } from '../../lib/utils'
import IconDelete from '../../components/icons/IconDelete'
import Meta from '../../components/layout/Meta'
import React from 'react'
import { getAllCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import DataBadge from '../../components/data/DataBadge'

export default function Collection({
  collection,
  libraries,
  allItems,
  columns,
}) {
  const [session] = useSession()
  const router = useRouter()

  const { data: swrCollection } = useSWR('/api/collection/' + collection._id)
  collection = swrCollection || collection

  const { data: swrItems } = useSWR('/api/items')
  allItems = swrItems || allItems
  const items = collection.items.map((itemId) =>
    allItems.find((item) => item._id === itemId)
  )

  const { data: swrLibraries } = useSWR('/api/libraries')
  libraries = (swrLibraries || libraries).filter((library) =>
    library.collections.some((t) => t === collection._id)
  )
  const { data: swrColumns } = useSWR('/api/columns')
  columns = swrColumns || columns

  return (
    <>
      <Head>
        <title>
          {collection.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
        </title>

        <Meta
          title={collection.name}
          description={collection.description}
          image={process.env.NEXT_PUBLIC_DOMAIN + '/img/' + collection.img}
        />
      </Head>

      <div className={'row'}>
        <div className={'col-auto'}>
          <div className={'d-absolute mb-2'}>
            <Image
              src={'/img/' + collection.img}
              alt={'Image of collection'}
              width={'148px'}
              height={'148px'}
              className={'rounded-circle bg-6'}
            />
          </div>
        </div>
        <div className={'col'}>
          <div className={'row'}>
            <div className={'col'}>
              <h2>
                <IconCollection /> {collection.name}
                {canEdit(session) && (
                  <Link href={'/edit/collection/' + collection._id}>
                    <a data-tip={'Edit collection'} className={'ms-2'}>
                      <IconEdit />
                    </a>
                  </Link>
                )}
              </h2>
            </div>
            <div className={'col-12 col-md-auto mb-2'}>
              {collection.nsfw && <IconNSFW />}
              {canEdit(session) && (
                <IconDelete
                  className={'ms-2'}
                  title={'Delete collection'}
                  onClick={() => {
                    if (
                      confirm(
                        'Do you really want to delete the collection "' +
                          collection.name +
                          '"?'
                      )
                    ) {
                      postData(
                        '/api/delete/collection',
                        { _id: collection._id },
                        () => {
                          router
                            .push('/collections')
                            .then(() =>
                              console.log('Deleted collection', collection._id)
                            )
                        }
                      )
                    }
                  }}
                />
              )}
              <span className={'ms-2'}>
                <ViewAllButton type={Types.collection} />
              </span>
            </div>
          </div>

          <p
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            {collection.description}
          </p>
        </div>
      </div>

      <div className={'card bg-2 my-2'}>
        <div className={'card-body pb-1'}>
          <h5 className={'card-title'}>Part of the libraries</h5>
          <div className={'d-flex flex-wrap'}>
            {libraries.map((t) => {
              return (
                <Link href={'/library/' + t.urlId} key={t._id}>
                  <a data-tip={'View library' + t.name}>
                    <div className={'badge rounded-pill bg-primary mb-2 me-2'}>
                      {t.name}
                    </div>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <ItemBoard
        _id={collection._id}
        items={items}
        allItems={allItems}
        showSponsors={true}
        columns={columns}
        canEdit={canEdit(session)}
      />
    </>
  )
}

export async function getStaticPaths() {
  const collections = await getCollections()
  const paths = collections.map((collection) => {
    return {
      params: {
        id: collection.urlId,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const collection = await getByUrlId('collections', params.id)
  if (!collection) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: {
      collection,
      libraries: await getAllCache(Types.library),
      allItems: await getAllCache(Types.item),
      columns: await getAllCache(Types.column),
    },
    revalidate: 60,
  }
}
