import Layout from '../../components/layout'
import Tab from "../../components/tab";
import {getTabs} from "../../lib/tabs";
import {getColumns} from "../../lib/columns";

export default function Post({tab, columns}) {
    return <Layout>
        <Tab tab={tab} columns={columns}/>
    </Layout>
}

export async function getStaticPaths() {
    const paths = getTabs().map(tab => {
        return {
            params: {
                id: tab.id
            }
        }
    })
    console.log(paths, getTabs())
    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({params}) {
    const tab = getTabs().filter(t => t.id === params.id)[0]
    const columns = getColumns()
    return {
        props: {tab, columns},
        revalidate: 600
    };
}
