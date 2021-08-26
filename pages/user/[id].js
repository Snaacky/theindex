import Layout, {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from "next/router"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {isAdmin} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import {getUser, getUsers} from "../../lib/db/users"

export default function User({tabs, user}) {
    const router = useRouter()
    const [session] = useSession()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"User " + user.name + " | " + siteName}
            </title>
            <meta name="robots" content="noindex, archive, follow"/>
            <meta name="description" content={user.description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h3>
                        {user.name}
                        <span className={"ms-2"} style={{fontSize: "1.2rem"}}>
                            <DataBadge title={user.accountType} style={"primary"}/>
                            <div className={"float-end"}>
                                {isAdmin(session) ? <Link href={"/edit/user/" + user.uid}>
                                    <a title={"Edit user"} className={"ms-2"}>
                                        <IconEdit/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                    </h3>
                </div>
                <p className={"card-text"}>
                    {user.description || <span className={"text-muted"}>
                        It seems quite empty here
                    </span>}
                </p>
            </div>
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const users = await getUsers()
    const paths = users.map(u => {
        return {
            params: {
                id: u.uid.toString()
            }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({params}) {
    const tabs = await getTabsWithTables()
    const user = await getUser(params.id)
    user.uid = user.uid.toString()

    return {
        props: {
            tabs,
            user
        },
        revalidate: 10
    }
}
