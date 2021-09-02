import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import {useSession} from "next-auth/client"
import {isAdmin, isCurrentUser} from "../../lib/session"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DataBadge from "../../components/data/DataBadge"
import {getUser, getUsers} from "../../lib/db/users"
import useSWR from "swr"
import Error from "../_error"

export default function User({uid, user: staticUser}) {
    const [session] = useSession()
    const {data: user, error} = useSWR("/api/user/" + uid)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }

    const name = user ? user.name : staticUser.name
    const description = user ? user.description : staticUser.description
    const image = user ? user.image : staticUser.image
    const accountType = user ? user.accountType : staticUser.accountType
    return <>
        <Head>
            <title>
                {"User " + name + " | " + siteName}
            </title>
            <meta name="robots" content="noindex, archive, follow"/>
            <meta name="description" content={description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body pb-0">
                <div className={"card-title row"}>
                    <div className={"col-auto"} style={{
                        height: "40px",
                        overflow: "show"
                    }}>
                        <Image className={"rounded"} src={image} alt={"Profile picture of " + name} width={64}
                               height={64}/>
                    </div>
                    <div className={"col"}>
                        <h3>
                            {name}
                            <span className={"ms-2"} style={{fontSize: "1.2rem"}}>
                            <DataBadge name={accountType} style={"primary"}/>
                            <div className={"float-end"}>
                                {isAdmin(session) || isCurrentUser(session, uid) ? <Link href={"/edit/user/" + uid}>
                                    <a title={"Edit user"} className={"ms-2"}>
                                        <FontAwesomeIcon icon={["fas", "cog"]}/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                        </h3>
                    </div>
                </div>
            </div>
            <div className={"card-body bg-6"}>
                <p className={"card-text"}>
                    {description || <span className={"text-muted"}>
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
            uid: params.id,
            user
        },
        revalidate: 10
    }
}
