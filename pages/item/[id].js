import Layout from '../../components/layout'
import Head from "next/head";
import {getTablesByTab} from "../../lib/tables";

export default function Post({postData}) {
    /**
    {tabs.forEach(tab => {
        const d = getTablesByTab(tab)
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/tab/{tab}"
                   id="animeNavbarDropdownMenuLink" role="button"
                   data-bs-toggle="dropdown" aria-expanded="false">
                    {tab}
                </a>
                <ul className="dropdown-menu" aria-labelledby="animeNavbarDropdownMenuLink">
                    {d.forEach(table => {
                        return (
                            <li><a className="dropdown-item" href="/table/{table}">
                                {table}
                            </a></li>
                        )
                    })}
                </ul>
            </li>
        )
    })}*/
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

export async function getStaticPaths() {

}

export async function getStaticProps() {
    const res = await fetch('https://...');
    const data = await res.json();

    return {
        props: {data},
        revalidate: 600
    };
}
