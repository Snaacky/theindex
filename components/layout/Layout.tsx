// noinspection SpellCheckingInspection

import Head from 'next/head'
import Navbar from '../navbar/Navbar'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify'
import ReactTooltip from 'react-tooltip'

const Layout = ({ children, error }) => {
  return (
    <div
      className={'d-flex'}
      style={{
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <Head>
        <meta charSet='UTF-8' />
        <meta content='IE=Edge' httpEquiv='X-UA-Compatible' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />

        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon/favicon-16x16.png'
        />
        <link
          rel='mask-icon'
          href='/favicon/safari-pinned-library.svg'
          color='#484848'
        />
        <meta
          name='msapplication-config'
          content='/favicons/browserconfig.xml'
        />
        <meta name='msapplication-TileColor' content='#2b5797' />
        <meta name='theme-color' content='#000000' />

        <title>
          {error && 'Error ' + error + ' |'} {process.env.NEXT_PUBLIC_SITE_NAME}
        </title>

        <meta name='robots' content='index, archive, follow' />

        <meta property='og:type' content='website' />
        <meta name='twitter:site' content='@ranimepiracy' />
        <meta
          property='og:site_name'
          content={process.env.NEXT_PUBLIC_SITE_NAME}
        />
        <meta name='twitter:card' content='summary' />
      </Head>
      <header>
        <Navbar />
      </header>

      <div className={'container my-4'}>
        <main>{children}</main>
      </div>

      <ToastContainer
        position={'bottom-right'}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme={'dark'}
      />
      <ReactTooltip place='top' type='dark' effect='solid' />
      <Footer error={error} />
      <script src={'/stats.js'} async={true} defer={true} />
    </div>
  )
}

export default Layout
