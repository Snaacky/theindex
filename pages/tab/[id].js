import Layout from '../../components/layout'
import Tab from "../../components/tab";
import {getTabs, getTabsWithTables} from "../../lib/db/tabs";
import {useRouter} from 'next/router'
import Loader from "../../components/loading";

export default function Post({tabs, tab}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Tab tab={tab}/>
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
        fallback: 'blocking',
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
