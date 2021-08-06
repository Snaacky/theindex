import Layout, {siteTitle} from '../../components/layout/layout'
import {getTabsWithTables} from "../../lib/db/tabs"
import {useRouter} from 'next/router'
import Loader from "../../components/loading"
import {getTables, getTableWithColumnsAndItems} from "../../lib/db/tables"
import Head from 'next/head'
import {getByURL_ID} from "../../lib/db/db"
import ColumnFilter from "../../components/column-filter"
import ItemTable from "../../components/item-table";

export default function Post({tabs, table}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {table.title + " | " + siteTitle}
            </title>
            <meta name="description" content={table.description}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body">
                <div className={"card-title d-flex justify-content-between"}
                     style={{
                         flexDirection: "row"
                     }}>
                        <span className="h3">
                            {table.title}
                        </span>
                    <div>
                        <button className={"btn btn-outline-primary"} type={"button"}
                                data-bs-toggle={"collapse"} data-bs-target={"#collapseFilter-" + table.url_id}
                                aria-expanded="false" aria-controls={"collapseFilter-" + table.url_id}>
                            Filter
                        </button>
                    </div>
                </div>
                <div id={"collapseFilter-" + table.url_id}
                     className="collapse row g-3">
                    <ColumnFilter columns={table.columns} onChange={console.log}/>
                </div>
                <ItemTable items={table.items} columns={table.columns}/>
            </div>
        </div>
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
    const table = await getTableWithColumnsAndItems(await getByURL_ID("tables", params.id))

    return {
        props: {tabs, table},
        revalidate: 60
    };
}
