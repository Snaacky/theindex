import {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {useSession} from "next-auth/client"
import Link from "next/link"
import {getUser} from "../../../lib/db/users"
import {isAdmin, isCurrentUser} from "../../../lib/session"
import EditUser from "../../../components/edit/EditUser"
import NotAdmin from "../../../components/layout/NotAdmin"
import ViewAll from "../../../components/buttons/ViewAll"

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

        <h2>
            Edit user <Link href={"/user/" + uid}>{user.name}</Link>
            <span className={"float-end"}>
                <ViewAll type={"users"}/>
            </span>
        </h2>
        <small className={"text-muted"}>
            ID: <code>{uid}</code>
        </small>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
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
