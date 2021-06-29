import Head from 'next/head'
import Link from 'next/link'
import Layout, {siteTitle} from '../components/layout'
import {getTabs} from "../lib/tabs";

export default function Home({data}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <div className={"container"}>
                <h1 className={"mb-2"}>
                    I am searching for a site with:
                </h1>
                <div className={"gx-4"}>
                    {data.map(({id, title}) => {
                        return (
                            <Link href={"/tab/" + id} key={id}>
                                <a type={"button"} className={"btn btn-lg btn-outline-primary me-3"}>
                                    {title}
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const data = getTabs()
    console.log("YYYY", data)
    return {
        props: {data},
        revalidate: 10
    };
}