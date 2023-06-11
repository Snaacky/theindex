import styles from './NotLogin.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Image from 'next/image'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'

const title = 'Access denied - ' + process.env.NEXT_PUBLIC_SITE_NAME
const description = 'You are missing privileges to view the site'

export default function NotAdmin() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Access denied</title>

        <meta name='robots' content='noindex, noarchive' />

        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />

        <meta name='description' content={description} />
        <meta property='og:description' content={description} />
        <meta name='twitter:description' content={description} />

        <meta
          name='twitter:image'
          content={process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png'}
        />
        <meta
          property='og:image'
          content={process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png'}
        />
      </Head>
      <h3 className={'mt-5 mb-3'}>This page is protected</h3>

      <Image
        width={128}
        height={128}
        src={'/img/TsumikiNyan.gif'}
        alt={''}
        className={'rounded'}
      />
      <p>You do not seem to have enough rights to access this page</p>
      <Link
        href={'/'}
        className={'btn btn-outline-success'}
        data-tooltip-content={'Go back'}
      >
        <FontAwesomeIcon icon={faSignInAlt} /> Home
      </Link>
    </div>
  )
}
