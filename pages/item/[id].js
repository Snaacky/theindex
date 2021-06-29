import Layout from '../../components/layout'
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";

export default function Post({postData}) {
    return <Layout>
        <Head>
            <title>{postData.title}</title>
        </Head>

        {postData.title}
        <br/>
        {postData.id}
        <br/>
        {postData.date}
    </Layout>
}

export async function getServerSideProps({context}) {
    const postData = getPostData(context.params.id)
    return {
        props: {
            postData
        }
    }
}
