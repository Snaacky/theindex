import Layout from '../../components/layout'
import {getTabsWithTables} from "../../lib/db/tabs";
import {getColumns} from "../../lib/db/columns";
import {useRouter} from 'next/router'
import Loader from "../../components/loading";
import {getTable, getTables} from "../../lib/db/tables";
import Table from "../../components/table";

export default function Post({tabs, tab, columns}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Table tab={tab} columns={columns}/>
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
    const table = await getTable(params.id)
    const columns = await getColumns()

    return {
        props: {tabs, table, columns},
        revalidate: 600
    };
}
