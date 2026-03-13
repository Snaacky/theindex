import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'react-tooltip/dist/react-tooltip.css'
// custom css
import '../styles/global.css'

import { SessionProvider, useSession } from 'next-auth/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import Loader from '../components/loading'
import { SWRConfig } from 'swr'
import Layout from '../components/layout/Layout'
import { isAdmin, isEditor, isLogin } from '../lib/session'
import NotAdmin from '../components/layout/NotAdmin'
import NotLogin from '../components/layout/NotLogin'
import NoScriptAlert from '../components/alerts/NoScriptAlert'
import { toast } from 'react-toastify'

// disable autoconfig css of fontawesome, see: https://fontawesome.com/docs/web/use-with/react/use-with
config.autoAddCss = false

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then(async (res) => {
            // 200 - not ok, 502 - prevent downtime proxy error pollution
            if (res.status !== 200 && res.status !== 502) {
              toast.error(
                <div>
                  <div>
                    <code>{res.status}</code> - Error
                  </div>
                </div>
              )
              throw new Error('Failed to fetch api endpoint :(')
            }

            return await res.json()
          }),
        revalidateOnFocus: false,
        revalidateIfStale: false,
        onError: (error, key) => {
          console.error('SWR errored:', error, 'at path', key)
        },
      }}
    >
      <SessionProvider
        session={session}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
        refetchInterval={0}
      >
        <Layout>
          <Auth auth={Component.auth}>
            <noscript>
              <NoScriptAlert />
            </noscript>

            <Component {...pageProps} />
          </Auth>
        </Layout>
      </SessionProvider>
    </SWRConfig>
  )
}

// login protected pages
function Auth({ auth, children }) {
  const { data: session, status } = useSession()

  // no auth required
  if (typeof auth === 'undefined' || auth === null) {
    return children
  } else if (status === 'loading') {
    return <Loader />
  } else if (!isLogin(session)) {
    return <NotLogin />
  } else if (auth.requireAdmin && !isAdmin(session)) {
    return <NotAdmin />
  } else if (auth.requireEditor && !isEditor(session)) {
    return <NotAdmin />
  }

  return children
}
