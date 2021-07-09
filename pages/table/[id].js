import Layout from '../../components/layout/layout'
import {getTabsWithTables} from "../../lib/db/tabs";
import {useRouter} from 'next/router'
import Loader from "../../components/loading";
import {getTables, getTableWithColumnsAndItems} from "../../lib/db/tables";
import Table from "../../components/pages/table";
import {getByURL_ID} from "../../lib/db/db";

export default function Post({tabs, table, columns}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Table table={table} columns={columns}/>
    </Layout>
}

export async function getStaticPaths() {
    const tables = await getTables()
    const paths = tables.map(table => {
        return {
            params: {
                id: table.url_id
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
    const table = await getTableWithColumnsAndItems(await getByURL_ID("tables", params.id))
    console.log("Table url_id", params.id, table)

    return {
        props: {tabs, table},
        revalidate: 60
    };
}
