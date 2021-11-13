import styles from './NotLogin.module.css'
import { signIn } from 'next-auth/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Image from 'next/image'

const title = 'Login to continue - ' + process.env.NEXT_PUBLIC_SITE_NAME
const description = 'You need to login to view the site'

export default function NotLogin() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Login to continue</title>
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
        src={'/img/mioWAAH.gif'}
        alt={''}
        className={'rounded'}
      />
      <p>You are currently not logged in</p>
      <button className={'btn btn-outline-success'} onClick={signIn}>
        <FontAwesomeIcon icon={['fas', 'sign-in-alt']} /> Sign In
      </button>
    </div>
  )
}
