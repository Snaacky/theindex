import Layout from '../../components/layout'
import Head from "next/head";
import {getTabs} from "../../lib/tabs";
import {useRouter} from 'next/router'
import Loader from "../../components/loading";

export default function Item({tabs, data}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>{data.title}</title>
        </Head>

        {data.title}
        <br/>
        {data.id}
        <br/>
        {data.date}
    </Layout>
}

export async function getStaticPaths() {
    return {
        paths: [{
            params: {
                id: "ne"
            }
        }],
        fallback: true
    }
}

export async function getStaticProps({params}) {
    const tabs = getTabs()

    return {
        props: {
            tabs,
            data: {
                title: "TITLE",
                id: "yeah",
                date: "tomorrow"
            }
        },
        revalidate: 10
    }
}
