import Layout, {siteTitle} from '../../components/layout/layout'
import Head from 'next/head'
import Image from "next/image"
import Link from "next/link"
import {getTabs, getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from 'next/router'
import Loader from "../../components/loading"

export default function Post({tabs, tab}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {tab.title + " | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {tab.title}
                    </h2>
                </div>
                <p className={"card-text"}>
                    {tab.description}
                </p>
            </div>
        </div>

        <div className={"d-flex flex-wrap"}>
            {tab.tables.map(t => {
                return <div className={"card bg-2 mb-2 me-2"} key={t.url_id} style={{
                    maxWidth: "28rem"
                }}>
                    <div className="row g-0">
                        <div className="col-auto p-1">
                            <Image src={t.img ? t.img : "/img/puzzled.png"} className="img-fluid rounded-start"
                                   alt="..." width={128} height={128}/>
                        </div>
                        <div className="col">
                            <div className={"card-body"}>
                                <h5 className={"card-title"}>
                                    {t.title}
                                </h5>

                                <p className={"card-text"}>
                                    {t.description}
                                </p>
                                <Link href={"/table/" + t.url_id}>
                                    <a className={"btn btn-primary"}>
                                        Take a look
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </Layout>
}

export async function getStaticPaths() {
    const tabs = await getTabs()
    const paths = tabs.map(tab => {
        return {
            params: {
                id: tab.url_id
            }
        }
    })

    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({params}) {
    const tabs = await getTabsWithTables()
    const tab = tabs.filter(t => t.url_id === params.id)[0]
    if (!tab) {
        return {
            notFound: true,
            revalidate: 60
        }
    }

    return {
        props: {tabs, tab},
        revalidate: 60
    };
}
