import Layout, {siteTitle} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../components/Login"
import React from "react"
import styles from "../../components/rows/TableRow.module.css"
import IconAdd from "../../components/icons/IconAdd"
import {getTables} from "../../lib/db/tables"
import TableRow from "../../components/rows/TableRow"
import IconTable from "../../components/icons/IconTable"

export default function EditorTables({tabs, tables}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Table manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        <IconTable size={24}/> Table manager
                    </h2>
                </div>
                <div>
                    {tables.map(t => {
                        return <TableRow table={t} className={"bg-4"} remove={() => {
                            if (confirm("Do you really want to delete the table '" + t.title + "'?")) {
                                fetch("/api/delete/table", {
                                    method: "post",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        _id: t._id
                                    })
                                }).then(r => {
                                    if (r.status !== 200) {
                                        alert("Failed to delete tab '" + t.title + "'")
                                    } else {
                                        window.location.reload(true)
                                    }
                                })
                            }
                        }} key={t._id}/>
                    })}
                    <div className={styles.row + " card bg-4 my-2"}>
                        <div className="row g-0">
                            <div className={styles.column + " col-auto p-1"}>
                                <Link href={"/edit/table/_new"}>
                                    <a title={"Create a new table"} style={{
                                        width: "42px",
                                        height: "42px"
                                    }}>
                                        <IconAdd/>
                                    </a>
                                </Link>
                            </div>
                            <div className="col">
                                <div className={"card-body"}>
                                    <h5 className={"card-title"}>
                                        Create a new table
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            tables: await getTables()
        }
    }
}
