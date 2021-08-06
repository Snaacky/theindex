// custom css
import "../styles/global.css"
import "../styles/arrayInput.css"
import {Provider, signIn, useSession} from "next-auth/client"
import Loader from "../components/loading"
import {useEffect} from "react"

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
