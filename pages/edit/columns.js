import Layout, {siteTitle} from "../../components/layout/layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../components/Login"
import React from "react"
import styles from "../../components/rows/TableRow.module.css"
import IconAdd from "../../components/icons/IconAdd"
import {getColumns} from "../../lib/db/columns"
import IconColumn from "../../components/icons/IconColumn"
import ColumnRow from "../../components/rows/ColumnRow"

export default function EditorColumns({tabs, columns}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Columns manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        <IconColumn size={24}/> Columns manager
                    </h2>
                </div>
                <div>
                    {columns.map(c => {
                        return <ColumnRow column={c} remove={() => {
                            if (confirm("Do you really want to delete the column '" + c.title + "'?")) {
                                fetch("/api/delete/column", {
                                    method: "post",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        _id: c._id
                                    })
                                }).then(r => {
                                    if (r.status !== 200) {
                                        alert("Failed to delete tab '" + c.title + "'")
                                    }
                                })
                            }
                        }} key={c._id}/>
                    })}
                    <div className={styles.row + " card bg-2 my-2"}>
                        <div className="row g-0">
                            <div className={styles.column + " col-auto p-1"}>
                                <Link href={"/edit/column/_new"}>
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
                                        Create a new column
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
            columns: await getColumns()
        }
    }
}
