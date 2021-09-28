import Head from 'next/head'
import Image from 'next/image'
import { images } from '../lib/icon'

export default function Admin({ images }) {
  return (
    <>
      <Head>
        <title>Admin | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>
      <div className={'mb-4'}>
        I placed the button here for now, as I have not really thought about
        where else to put them...
        <br />
        <a
          className={'btn btn-outline-secondary'}
          href={'/api/export'}
          target={'_blank'}
          rel='noreferrer'
        >
          Export all data
        </a>
      </div>
      Emoji dump:
      <div>
        {images.map((i) => (
          <div className={'m-1 d-inline-flex'} key={i}>
            <Image
              width={64}
              height={64}
              src={i}
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
  return {
    props: {
      images: images(),
    },
  }
}
