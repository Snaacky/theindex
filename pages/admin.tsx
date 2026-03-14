import Head from 'next/head'
import Link from 'next/link'
import { postData } from '../lib/utils'
import { useSession } from 'next-auth/react'
import type { Column } from '../types/Column'
import type { Item } from '../types/Item'
import type { Collection } from '../types/Collection'
import type { Library } from '../types/Library'
import ItemBoard from '../components/boards/ItemBoard'
import { listAllScreenshotFilenames } from '../lib/db/itemScreenshots'
import DataBadge from '../components/data/DataBadge'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'

const Admin = ({
  columns,
  itemsWithNoScreenshots,
  orphanedItems,
  items,
}: {
  columns: Column[]
  itemsWithNoScreenshots: Item[]
  orphanedItems: Item[]
  items: Item[]
}) => {
  const { data: session } = useSession()
  const itemsWithNoUrl = items.filter((item) => item.urls.length === 0)

  return (
    <>
      <Head>
        <title>Admin | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>
      <Link
        href={'/admin/users'}
        className={'btn btn-outline-success mb-2 me-2'}
      >
        All users
      </Link>
      <button
        className={'btn btn-outline-danger mb-2 me-2'}
        onClick={() => {
          postData('/api/admin/cache/clear', { clearCache: true })
        }}
      >
        Clear cache
      </button>

      <h4>Screenshots</h4>
      <button
        className={'btn btn-outline-danger mb-2 me-2'}
        onClick={() => {
          postData('/api/admin/screenshot/clear', { clearScreenshot: true })
        }}
      >
        Wipe screenshots
      </button>
      <button
        className={'btn btn-outline-warning mb-2 me-2'}
        onClick={() => {
          postData('/api/admin/screenshot/createAll', { createAll: true })
        }}
      >
        Create missing screenshots
      </button>

      <h4>Discord Webhooks</h4>
      <button
        className={'btn btn-warning mb-2 me-2'}
        onClick={() => {
          if (
            !('NEXT_PUBLIC_AUDIT_WEBHOOK' in process.env) ||
            process.env.NEXT_PUBLIC_AUDIT_WEBHOOK?.length === 0
          ) {
            return alert("ENV 'NEXT_PUBLIC_AUDIT_WEBHOOK' not provided")
          }

          console.log(
            'Testing post to webhook',
            process.env.NEXT_PUBLIC_AUDIT_WEBHOOK
          )
          postData(process.env.NEXT_PUBLIC_AUDIT_WEBHOOK, {
            username: 'Index Test',
            avatar_url: process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png',
            embeds: [
              {
                title: 'Hurray !!! We are online',
                description: 'This is a ping test',
                url: process.env.NEXT_PUBLIC_DOMAIN,
                color: 15548997, // red
                author: {
                  name: session?.user.name,
                  icon_url: session?.user.image,
                },
              },
            ],
          })
        }}
        disabled={
          !('NEXT_PUBLIC_AUDIT_WEBHOOK' in process.env) ||
          process.env.NEXT_PUBLIC_AUDIT_WEBHOOK?.length === 0
        }
      >
        Send test webhook
      </button>

      <h4>
        <DataBadge name={'' + items.length} />
        Items in total
      </h4>

      <h4>
        <DataBadge name={'' + itemsWithNoScreenshots.length} />
        Items with no screenshots
      </h4>
      <ItemBoard
        contentOf={null}
        items={itemsWithNoScreenshots}
        allItems={itemsWithNoScreenshots}
        columns={columns}
      />

      <h4>
        <DataBadge name={'' + itemsWithNoUrl.length} />
        Items with no url
      </h4>
      <ItemBoard
        contentOf={null}
        items={itemsWithNoUrl}
        allItems={itemsWithNoUrl}
        columns={columns}
      />

      <h4>
        <DataBadge name={'' + orphanedItems.length} />
        Items not in a collection or library
      </h4>
      <p className={'text-muted'}>
        Includes items with no collection at all, or items that are only in
        collections that are not attached to any library.
      </p>
      <ItemBoard
        contentOf={null}
        items={orphanedItems}
        allItems={orphanedItems}
        columns={columns}
      />
    </>
  )
}

Admin.auth = {
  requireAdmin: true,
}

export default Admin

export async function getServerSideProps() {
  const items = (await getAllCache(Types.item)) as Item[]
  const collections = (await getAllCache(Types.collection)) as Collection[]
  const libraries = (await getAllCache(Types.library)) as Library[]
  const screenshotFilenames = new Set(await listAllScreenshotFilenames())
  const libraryCollectionIds = new Set(
    libraries.flatMap((library) => library.collections || [])
  )
  const orphanedItems = items.filter((item) => {
    const itemCollections = collections.filter((collection) =>
      (collection.items || []).includes(item._id)
    )

    if (itemCollections.length === 0) {
      return true
    }

    return !itemCollections.some((collection) =>
      libraryCollectionIds.has(collection._id)
    )
  })

  const missingScreenshots = items.filter(
    (item) => !screenshotFilenames.has(item._id)
  )
  return {
    props: {
      columns: await getAllCache(Types.column),
      itemsWithNoScreenshots: missingScreenshots,
      orphanedItems,
      items: items,
    },
  }
}
