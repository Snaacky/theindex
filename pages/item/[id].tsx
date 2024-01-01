import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { canEdit, isAdmin, isEditor } from '../../lib/session'
import DataItem from '../../components/data/DataItem'
import IconEdit from '../../components/icons/IconEdit'
import DataBadge from '../../components/data/DataBadge'
import { splitColumnsIntoTypes } from '../../lib/item'
import IconStar from '../../components/icons/IconStar'
import IconBookmark from '../../components/icons/IconBookmark'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconNewTabLink from '../../components/icons/IconNewTabLink'
import OnlineStatus from '../../components/data/OnlineStatus'
import IconNSFW from '../../components/icons/IconNSFW'
import IconSponsor from '../../components/icons/IconSponsor'
import UrlBadge from '../../components/data/UrlBadge'
import { postData } from '../../lib/utils'
import Meta from '../../components/layout/Meta'
import React, { FC } from 'react'
import { getAllCache, getSingleCache } from '../../lib/db/cache'
import { Types } from '../../types/Components'
import useSWR from 'swr'
import { Item } from '../../types/Item'
import { Column } from '../../types/Column'
import { Collection } from '../../types/Collection'
import DeleteButton from '../../components/buttons/DeleteButton'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'

type Props = {
  item: Item
  columns: Column[]
  collections: Collection[]
}

const Item: FC<Props> = ({ item, columns, collections }) => {
  const { data: session } = useSession()

  const { data: swrItem } = useSWR('/api/item/' + item._id, {
    fallbackData: item,
  })
  item = swrItem || item
  item.stars = item.stars || 0
  const { data: swrColumns } = useSWR('/api/columns', {
    fallbackData: columns,
  })
  columns = swrColumns || columns
  const { data: swrCollections } = useSWR('/api/collections', {
    fallbackData: collections,
  })
  collections = (swrCollections || collections).filter((t) =>
    t.items.includes(item._id)
  )
  const {
    features: featuresColumns,
    pro: proColumns,
    con: conColumns,
    array: arrayColumns,
    text: textColumns,
  } = splitColumnsIntoTypes(
    Object.keys(item.data).map((k) => columns.find((c) => c._id === k)),
    item.data
  )

  const image =
    process.env.NEXT_PUBLIC_DOMAIN +
    (item.blacklist
      ? '/blacklisted-screenshot.png'
      : '/api/item/screenshot/' + item._id)
  return (
    <>
      <Head>
        <title>{item.name + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta name='twitter:card' content='summary_large_image' />

        <Meta title={item.name} description={item.description} image={image} />

        {item.blacklist && (
          <meta name='robots' content='noindex, archive, follow' />
        )}
      </Head>

      <div className={'row'}>
        <div className={'col-12 col-md-4 col-lg-6 col-xl-4'}>
          <h2>
            <OnlineStatus item={item} />
            {item.blacklist ? (
              <span className={'text-danger'}>
                Blacklisted: <del>{item.name}</del>
              </span>
            ) : (
              item.name
            )}
            <IconNewTabLink
              url={item.urls[0]}
              className={'umami--click--open-' + item.name}
            />
            {canEdit(session) && (
              <Link
                href={'/edit/item/' + item._id}
                data-tooltip-content={'Edit item'}
                className={'ms-2'}
              >
                <IconEdit />
              </Link>
            )}
            {canEdit(session) && (
              <DeleteButton
                type={Types.item}
                content={item}
                className={'ms-2'}
              />
            )}
          </h2>

          <p>
            User starred this item:{' '}
            <small
              className={'text-warning'}
              data-tooltip-content={
                item.stars +
                ' user' +
                (item.stars === 1 ? '' : 's') +
                ' have starred this item'
              }
            >
              {item.stars}
              <FontAwesomeIcon icon={faStar} className={'ms-1'} />
            </small>
          </p>

          <p
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            {item.description}
          </p>
        </div>

        <div className={'col-12 col-md-8 col-lg-6 col-xl-8 position-relative'}>
          <div
            className={'position-absolute'}
            style={{
              top: 0,
              right: '0.75rem',
            }}
          >
            <div
              className={'position-relative px-1 pt-1'}
              style={{
                zIndex: 200,
                background: 'rgba(0, 0, 0, 0.5)',
                borderBottomLeftRadius: '0.25rem',
              }}
            >
              {item.sponsor && (
                <span className={'me-2'}>
                  <IconSponsor />
                </span>
              )}
              {item.nsfw && (
                <span className={'me-2'}>
                  <IconNSFW />
                </span>
              )}
              <IconStar item={item} />
              <span className={'ms-2'}>
                <IconBookmark item={item} />
              </span>
            </div>
          </div>
          <Image
            src={'/api/item/screenshot/' + item._id}
            width={128}
            height={720}
            layout={'responsive'}
            className={'rounded'}
            alt={'Screenshot of the site ' + item.name}
            loader={({ src }) => src}
            unoptimized={true}
          />
          <div
            className={
              'text-muted float-end' + (isAdmin(session) ? ' mt-2' : '')
            }
          >
            Captured screenshot of the site <code>{item.urls[0]}</code>
            {isEditor(session) && (
              <button
                className={'ms-2 btn btn-sm btn-outline-warning'}
                onClick={() => {
                  postData('/api/admin/screenshot/create/' + item._id, {})
                }}
              >
                Retake
              </button>
            )}
          </div>
        </div>
      </div>

      {item.blacklist && (
        <div className={'card bg-2 my-2'}>
          <div className={'card-body'}>
            <p className={'card-text'}>
              This item has been{' '}
              <span className={'text-danger'}>blacklisted</span> due to
              misconduct of their stuff or breaking our rules.
              <br />
              You can apply to be un-
              <span className={'text-danger'}>blacklisted</span> by contacting
              our team on discord.
            </p>
          </div>
        </div>
      )}
      {(!item.blacklist || canEdit(session)) && (
        <>
          <div className={'card bg-2 my-2'}>
            <div className={'card-body pb-1'}>
              <h5 className={'card-title'}>Collections including this item</h5>
              <div className={'d-flex flex-wrap'}>
                {collections.map((t) => {
                  return (
                    <Link
                      href={'/collection/' + t.urlId}
                      key={t._id}
                      className={'me-2 mb-2'}
                      data-tooltip-content={'View collection ' + t.name}
                    >
                      <DataBadge name={t.name} style={'primary'} />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className={'card bg-2 my-2'}>
            <div className={'card-body pb-1'}>
              <h5 className={'card-title'}>Official links</h5>
              <div className={'d-flex flex-wrap'}>
                {item.urls.map((url) => (
                  <UrlBadge
                    url={url}
                    key={url}
                    className={'umami--click--open-' + item.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={'card bg-2 my-2'}>
            <div className={'card-body'}>
              <h5 className={'card-title'}>Features</h5>
              <div className={'d-flex flex-wrap'}>
                {featuresColumns.length === 0 && (
                  <span className={'text-muted'}>No features found</span>
                )}
                {featuresColumns.map((c) => {
                  return (
                    <DataItem
                      data={item.data[c._id] as boolean}
                      column={c}
                      key={c._id}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className={'card bg-2 my-2'}>
            <div className={'card-body'}>
              <h5 className={'card-title text-success'}>Pros</h5>
              <div className={'d-flex flex-wrap'}>
                {proColumns.length === 0 && (
                  <span className={'text-muted'}>No pros found</span>
                )}
                {proColumns.map((c) => {
                  return (
                    <DataItem
                      data={item.data[c._id] as boolean}
                      column={c}
                      key={c._id}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className={'card bg-2 my-2'}>
            <div className={'card-body'}>
              <h5 className={'card-title text-danger'}>Cons</h5>
              <div className={'d-flex flex-wrap'}>
                {conColumns.length === 0 && (
                  <span className={'text-muted'}>No cons found</span>
                )}
                {conColumns.map((c) => {
                  return (
                    <DataItem
                      data={item.data[c._id] as boolean}
                      column={c}
                      key={c._id}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className={'card bg-2 my-2'}>
            <div className={'card-body'}>
              <h5 className={'card-title'}>Other features are</h5>
              <div className={'d-flex flex-wrap'}>
                {arrayColumns.length === 0 && (
                  <span className={'text-muted'}>No data found</span>
                )}
                {arrayColumns.map((c) => {
                  return (
                    <div key={c._id}>
                      <Link
                        href={'/column/' + c.urlId}
                        className={'me-2'}
                        data-tooltip-content={'View column ' + c.name}
                      >
                        {c.name}:
                      </Link>
                      <DataItem
                        data={item.data[c._id] as string[]}
                        column={c}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {textColumns.length > 0 &&
            textColumns.map((c) => (
              <div className={'card bg-2 my-2'} key={c._id}>
                <div className={'card-body'}>
                  <h5 className={'card-title'}>{c.name}</h5>
                  <p className={'card-text'}>{item.data[c._id]}</p>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  )
}

export default Item

export async function getStaticPaths() {
  const items = await getAllCache(Types.item) as Item[]
  const paths = items.map((i) => {
    return {
      params: {
        id: i._id,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const item = await getSingleCache(Types.item, params.id) as Item
  if (!item) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: {
      item,
      columns: await getAllCache(Types.column),
      collections: await getAllCache(Types.collection),
    },
    revalidate: 60,
  }
}
