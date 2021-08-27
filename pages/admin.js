import Head from "next/head"
import Image from "next/image"
import Layout, {siteName} from "../components/layout/Layout"
import {images} from "../lib/icon"
import Login from "../components/layout/Login"
import {isAdmin} from "../lib/session"
import NotAdmin from "../components/layout/NotAdmin"
import {useSession} from "next-auth/client"

export default function Admin({images}) {
    const [session] = useSession()

    if (!session) {
        return <Login/>
    } else if (!isAdmin(session)) {
        return <NotAdmin/>
    }

    return (
        <Layout>
            <Head>
                <title>Admin | {siteName}</title>
            </Head>

            <div className={"mb-4"}>
                I placed the button here for now, as I have not really thought about where else to put them...
                <br/>
                <a className={"btn btn-outline-secondary"} href={"/api/export"} target={"_blank"} rel="noreferrer">
                    Export all data
                </a>
            </div>
            Emoji dump:
            <div>
                {images.map(i =>
                    <div className={"m-1 d-inline-flex"} key={i}>
                        <Image width={64} height={64} src={i} alt={""}
                               className={"rounded"}/>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    return {
        props: {
            images: images()
        },
        revalidate: 10
    }
}
