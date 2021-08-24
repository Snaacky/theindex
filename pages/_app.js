import "@fortawesome/fontawesome-svg-core/styles.css"
// custom css
import "../styles/global.css"
import {Provider, signIn, useSession} from "next-auth/client"
import {library} from "@fortawesome/fontawesome-svg-core"
import {fab} from "@fortawesome/free-brands-svg-icons"
import {fas} from "@fortawesome/free-solid-svg-icons"
import Loader from "../components/loading"
import {useEffect} from "react"

library.add(fab, fas)

export default function App({Component, pageProps}) {
    return <Provider session={pageProps.session}>
        {Component.auth ? (
            <Auth auth={Component.auth}>
                <Component {...pageProps} />
            </Auth>
        ) : (
            <Component {...pageProps} />
        )}
    </Provider>
}

// login protected pages
function Auth({auth, children}) {
    const [session, loading] = useSession()
    const isUser = !!session?.user
    useEffect(() => {
        if (loading) {
            return // Do nothing while loading
        }
        if (!isUser) {
            signIn() // If not authenticated, force log in
        }
    }, [isUser, loading])

    if (isUser) {
        console.log(session.user, auth)
        return children
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <Loader/>
}
