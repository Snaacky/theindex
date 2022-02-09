import Head from 'next/head'
import Link from 'next/link'
import { postData } from '../lib/utils'
import { useSession } from 'next-auth/react'
import { getColumns } from '../lib/db/columns'
import { Column } from '../types/Column'

const Admin = ({ columns }: { columns: Column[] }) => {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Admin | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>
      <Link href={'/admin/users'}>
        <a className={'btn btn-outline-success mb-2 me-2'}>All users</a>
      </Link>
      <button
        className={'btn btn-outline-danger mb-2 me-2'}
        onClick={() => {
          postData('/api/admin/cache/clear', { clearCache: true })
        }}
      >
        Clear cache
      </button>
      <a
        className={'btn btn-outline-secondary mb-2 me-2'}
        href={'/api/export'}
        target={'_blank'}
        rel='noreferrer'
      >
        Export all data
      </a>

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
        Recreate every screenshots
      </button>

      <h4>Discord Webhooks</h4>
      <button
        className={'btn btn-warning mb-2 me-2'}
        onClick={() => {
          if (
            !('NEXT_PUBLIC_AUDIT_WEBHOOK' in process.env) ||
            process.env.NEXT_PUBLIC_AUDIT_WEBHOOK.length === 0
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
                  name: session.user.name,
                  icon_url: session.user.image,
                },
              },
            ],
          })
        }}
        disabled={
          !('NEXT_PUBLIC_AUDIT_WEBHOOK' in process.env) ||
          process.env.NEXT_PUBLIC_AUDIT_WEBHOOK.length === 0
        }
      >
        Send test webhook
      </button>
    </>
  )
}

Admin.auth = {
  requireAdmin: true,
}

export default Admin

export async function getServerSideProps() {
  return {
    props: {
      columns: await getColumns(),
    },
  }
}
