import Layout, {siteName} from "../../../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../../components/Login"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getUser} from "../../../lib/db/users"
import {isAdmin} from "../../../lib/session"
import EditUser from "../../../components/edit/EditUser"
import NotAdmin from "../../../components/NotAdmin"

export default function EditorUser({uid, tabs, user}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    if (!isAdmin(session)) {
        return <Layout tabs={tabs}>
            <NotAdmin/>
        </Layout>
    }

    return <Layout tabs={tabs}>
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
                <EditUser uid={uid} accountType={user.accountType} description={user.description}/>
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps({params}) {
    const user = await getUser(params.id)
    user.uid = user.uid.toString()
    return {
        props: {
            uid: params.id,
            tabs: await getTabsWithTables(),
            user
        }
    }
}
