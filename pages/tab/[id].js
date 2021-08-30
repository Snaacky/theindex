import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getTabs} from "../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Loader from "../../components/loading"
import {canEdit} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import TableBoard from "../../components/boards/TableBoard"
import useSWR from "swr"
import Error from "../_error"
import {getByUrlId} from "../../lib/db/db"

export default function Tab({_id}) {
    const [session] = useSession()
    const {data: tab, error} = useSWR("/api/tab/" + _id)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!tab) {
        return <Loader/>
    }

    return <>
        <Head>
            <title>
                {tab.name + " | " + siteName}
            </title>
            <meta name="description" content={tab.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {tab.name}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {tab.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                            {canEdit(session) ? <Link href={"/edit/tab/" + tab._id}>
                                <a title={"Edit tab"} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link> : <></>}
                        </span>
                    </h2>
                </div>
                <p className={"card-text"}>
                    {tab.description}
                </p>
            </div>
        </div>

        <TableBoard _id={tab._id} tables={tab.tables} key={tab._id}/>
    </>
}

export async function getStaticPaths() {
    const tabs = await getTabs()
    const paths = tabs.map(tab => {
        return {
            params: {
                id: tab.urlId
            }
        }
    })

    return {
        paths,
        fallback: "blocking",
    }
}

export async function getStaticProps({params}) {
    const tab = await getByUrlId("tabs", params.id)
    if (!tab) {
        return {
            notFound: true,
            revalidate: 10
        }
    }

    return {
        props: {
            _id: tab._id
        },
        revalidate: 10
    }
}
