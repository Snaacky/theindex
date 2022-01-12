import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { images } from '../lib/icon'
import { getCache, setCache } from '../lib/db/cache'
import useSWR from 'swr'
import { postData } from '../lib/utils'

export default function Admin({ images: staticImages }) {
  const { data: swrImages } = useSWR('/api/images')
  staticImages = swrImages || staticImages

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

      <h4>Emoji dump:</h4>
      <div>
        {staticImages.map((i) => (
          <div className={'m-1 d-inline-flex'} key={i}>
            <Image
              width={64}
              height={64}
              src={'/img/' + i}
              alt={''}
              className={'rounded'}
            />
          </div>
        ))}
      </div>
    </>
  )
}

Admin.auth = {
  requireAdmin: true,
}

export async function getServerSideProps() {
  const key = 'images'
  let cache = await getCache(key)
  if (cache === null) {
    cache = images()
    setCache(key, cache).then(() => {
      console.info('Created cache for', key)
    })
  }

  return {
    props: {
      images: cache,
    },
  }
}
