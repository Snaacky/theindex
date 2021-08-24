import Layout, {siteTitle} from "../../components/layout/layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../components/Login"
import React from "react"
import styles from "../../components/rows/TableRow.module.css"
import IconAdd from "../../components/icons/IconAdd"
import IconItem from "../../components/icons/IconItem"
import ItemRow from "../../components/rows/ItemRow"
import {getItems} from "../../lib/db/items"

export default function EditorItems({tabs, items}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Item manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        <IconItem size={24}/> Item manager
                    </h2>
                </div>
                <div>
                    {items.map(i => {
                        return <ItemRow item={i} remove={() => {
                            if (confirm("Do you really want to delete the item '" + i.title + "'?")) {
                                fetch("/api/delete/item", {
                                    method: "post",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        _id: i._id
                                    })
                                }).then(r => {
                                    if (r.status !== 200) {
                                        alert("Failed to delete item '" + i.title + "'")
                                    } else {
                                        window.location.reload(true)
                                    }
                                })
                            }
                        }} key={i._id}/>
                    })}
                    <div className={styles.row + " card bg-2 my-2"}>
                        <div className="row g-0">
                            <div className={styles.column + " col-auto p-1"}>
                                <Link href={"/edit/item/_new"}>
                                    <a title={"Create a new item"} style={{
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
                                        Create a new item
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
            items: await getItems()
        }
    }
}
