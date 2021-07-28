// custom css
import '../styles/global.css'
import '../styles/arrayInput.css'
import {Provider} from "next-auth/client"

export default function App({Component, pageProps}) {
    return <Provider session={pageProps.session}>
        <Component {...pageProps} />
    </Provider>
}