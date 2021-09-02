import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {useSession} from "next-auth/client"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getUser} from "../../../lib/db/users"
import {isAdmin, isCurrentUser} from "../../../lib/session"
import EditUser from "../../../components/edit/EditUser"
import NotAdmin from "../../../components/layout/NotAdmin";

export default function EditorUser({uid, user}) {
    const [session] = useSession()

    if (!isCurrentUser(session, uid) && !isAdmin(session)) {
        return <NotAdmin/>
    }

    return <>
        <Head>
            <title>
                {"Edit user " + user.name + " | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        Edit user <Link href={"/user/" + uid}>{user.name}</Link>
                        <span className={"float-end"}>
                            <Link href={"/users"}>
                                <a className={"btn btn-outline-secondary"}>
                                    User manager
                                    <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                                </a>
                            </Link>
                        </span>
                    </h2>
                    <small className={"text-muted"}>
                        ID: <code>{uid}</code>
                    </small>
                </div>
                <EditUser adminEditing={isAdmin(session)} uid={uid} accountType={user.accountType}
                          description={user.description}/>
            </div>
        </div>
    </>
}

EditorUser.auth = {}

export async function getServerSideProps({params}) {
    const user = await getUser(params.id)
    if (!user) {
        return {
            notFound: true
        }
    }

    user.uid = user.uid.toString()
    return {
        props: {
            uid: params.id,
            user
        }
    }
}
