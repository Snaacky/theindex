import "@fortawesome/fontawesome-svg-core/styles.css"
// custom css
import "../styles/global.css"
import {Provider, useSession} from "next-auth/client"
import {library} from "@fortawesome/fontawesome-svg-core"
import {fab} from "@fortawesome/free-brands-svg-icons"
import {fas} from "@fortawesome/free-solid-svg-icons"
import {far} from "@fortawesome/free-regular-svg-icons"
import Loader from "../components/loading"
import {SWRConfig} from "swr"
import Layout from "../components/layout/Layout"
import {isAdmin, isEditor, isLogin} from "../lib/session"
import NotAdmin from "../components/layout/NotAdmin"
import NotLogin from "../components/layout/NotLogin"

library.add(fab, fas, far)

export default function App({Component, pageProps}) {
    return <Provider session={pageProps.session}>
        <SWRConfig value={{
            refreshInterval: 2000,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}>
            <Layout>
                <Auth auth={Component.auth}>
                    <Component {...pageProps} />
                </Auth>
            </Layout>
        </SWRConfig>
    </Provider>
}

// login protected pages
function Auth({auth, children}) {
    const [session, loading] = useSession()
    if (loading) {
        return <Loader/>
    }

    // no auth required
    if (typeof auth === "undefined" || auth === null) {
        return children
    } else if (!isLogin(session)) {
        return <NotLogin/>
    } else if (auth.requireAdmin && !isAdmin(session)) {
        return <NotAdmin/>
    } else if (auth.requireEditor && !isEditor(session)) {
        return <NotAdmin/>
    }

    return children
}
