import Head from 'next/head'
import Link from 'next/link'
import { postData } from '../lib/utils'
import { useSession } from 'next-auth/react'
import type { Column } from '../types/Column'
import type { Item } from '../types/Item'
import ItemBoard from '../components/boards/ItemBoard'
import { screenshotExists } from '../lib/db/itemScreenshots'
import DataBadge from '../components/data/DataBadge'
import { getAllCache } from '../lib/db/cache'
import { Types } from '../types/Components'
import { getLastViews } from '../lib/db/views'

const Admin = ({
  columns,
  itemsWithNoScreenshots,
  items,
  popular,
}: {
  columns: Column[]
  itemsWithNoScreenshots: Item[]
  items: Item[]
  popular: Item[]
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
      <Link
        className={'btn btn-outline-secondary mb-2 me-2'}
        href={'/api/export'}
        target={'_blank'}
        rel='noreferrer'
      >
        Export all data
      </Link>

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

      <h4>Items with the most current views in the last 10k item views</h4>
      <div>
        {popular.map((item, i) => (
          <div key={i + '_' + item.name}>
            {item.name} <DataBadge name={'#' + i} />
            <div>{item.views} Views</div>
          </div>
        ))}
      </div>
    </>
  )
}

Admin.auth = {
  requireAdmin: true,
}

export default Admin

export async function getServerSideProps() {
  const items = (await getAllCache(Types.item)) as Item[]
  let popular = (await getLastViews(Types.item, 10000)) as Item[]

  const missingScreenshots = await Promise.all(
    items.map(async (item) => {
      if (!(await screenshotExists(item._id))) {
        return item
      }
      return null
    })
  )
  return {
    props: {
      columns: await getAllCache(Types.column),
      itemsWithNoScreenshots: missingScreenshots.filter((s) => s !== null),
      items: items,
      popular: popular,
    },
  }
}
