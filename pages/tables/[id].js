import Layout from '../../components/layout'
import {getTabsWithTables} from "../../lib/db/tabs";
import {getColumns} from "../../lib/db/columns";
import {useRouter} from 'next/router'
import Loader from "../../components/loading";
import {getTable, getTables} from "../../lib/db/tables";
import Table from "../../components/table";
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
        fallback: true,
    }
}

export async function getStaticProps({params}) {
    const tabs = await getTabsWithTables()
    const table = await getByURL_ID(params.id)
    console.log("Table url_id", params.id, table)

    const columns = await getColumns()

    return {
        props: {tabs, table, columns},
        revalidate: 600
    };
}
