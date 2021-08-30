import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {isAdmin} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import {getUser, getUsers} from "../../lib/db/users"
import useSWR from "swr"
import Error from "../_error"

export default function User({uid}) {
    const [session] = useSession()
    const {data: user, error} = useSWR("/api/user/" + uid)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!user) {
        return <Loader/>
    }

    return <>
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
                            <DataBadge name={user.accountType} style={"primary"}/>
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
    </>
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
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const user = await getUser(params.id)
    if (!user) {
        return {
            notFound: true,
            revalidate: 10
        }
    }
    return {
        props: {
            uid: params.id
        },
        revalidate: 10
    }
}
