import { getCollections } from '../../lib/db/collections'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/client'
import { canEdit } from '../../lib/session'
import IconEdit from '../../components/icons/IconEdit'
import ItemBoard from '../../components/boards/ItemBoard'
import { getByUrlId } from '../../lib/db/db'
import { getLibraries } from '../../lib/db/libraries'
import ViewAllButton from '../../components/buttons/ViewAllButton'
import IconCollection from '../../components/icons/IconCollection'
import IconNSFW from '../../components/icons/IconNSFW'
import { postData } from '../../lib/utils'
import IconDelete from '../../components/icons/IconDelete'
import Meta from '../../components/layout/Meta'
import React from 'react'

export default function Collection({ _id, collection, libraries }) {
  const [session] = useSession()

  const librariesContainingCollection = libraries.filter((library) =>
    library.collections.some((t) => t._id === collection._id)
  )

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

      <div className={'row'} style={{ marginTop: '4rem' }}>
        <div className={'col-auto'}>
          <div className={'d-absolute mb-2'} style={{ marginTop: '-3.2rem' }}>
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
                {canEdit(session) ? (
                  <Link href={'/edit/collection/' + collection._id}>
                    <a title={'Edit collection'} className={'ms-2'}>
                      <IconEdit />
                    </a>
                  </Link>
                ) : (
                  <></>
                )}
              </h2>
            </div>
            <div className={'col-12 col-md-auto mb-2'}>
              {collection.nsfw ? <IconNSFW /> : <></>}
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
                          window.location.href = escape('/collections')
                        }
                      )
                    }
                  }}
                />
              )}
              <span className={'ms-2'}>
                <ViewAllButton type={'collections'} />
              </span>
            </div>
          </div>
          <div>
            {librariesContainingCollection.map((t) => {
              return (
                <Link href={'/library/' + t.urlId} key={t._id}>
                  <a title={'View library' + t.name}>
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
      <p
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {collection.description}
      </p>

      <ItemBoard
        _id={collection._id}
        items={collection.items}
        showSponsors={true}
        columns={collection.columns}
        key={collection._id}
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
      revalidate: 20,
    }
  }

  return {
    props: {
      _id: collection._id,
      collection,
      libraries: await getLibraries(),
    },
    revalidate: 20,
  }
}
