import Layout, {siteTitle} from "../../components/layout/layout"
import Head from "next/head"
import Link from "next/link"
import {getTabsWithTables} from "../../lib/db/tabs"
import {useSession} from "next-auth/client"
import Login from "../../components/Login"
import IconTab from "../../components/icons/IconTab"
import TabRow from "../../components/rows/TabRow"
import React from "react"
import styles from "../../components/rows/TableRow.module.css"
import IconAdd from "../../components/icons/IconAdd"

export default function EditorTabs({tabs}) {
    const [session] = useSession()

    if (!session) {
        return <Layout tabs={tabs}>
            <Login/>
        </Layout>
    }

    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Tab manager | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        <IconTab size={24}/> Tab manager
                    </h2>
                </div>
                <Tabs tabs={tabs}/>
            </div>
        </div>
    </Layout>
}

export async function getServerSideProps() {
    return {
        props: {
            tabs: await getTabsWithTables()
        }
    }
}

export class Tabs extends React.Component {
    constructor({tabs}) {
        super({tabs})

        tabs = tabs.map(tab => {
            tab.tables = tab.tables.map((t, i) => {
                return {
                    _id: t._id,
                    order: i
                }
            })
            return tab
        })
        this.state = {
            tabs
        }
    }

    async saveTab(tab) {
        return await fetch("/api/edit/tab", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                _id: tab._id,
                urlId: tab.urlId,
                title: tab.title,
                nsfw: tab.nsfw,
                description: tab.description,
                tables: tab.tables,
                order: tab.order
            })
        }).then(r => {
            return r.status === 200
        })
    }

    async moveTab(tab, sort) {
        let temp = this.state.tabs.find(t => t._id === tab._id)
        if (temp.order + sort < 0 || temp.order + sort === this.state.tabs.length) {
            return
        }

        temp.order += sort
        let temp2 = this.state.tabs[temp.order]
        temp2.order -= sort

        let copy = this.state.tabs
        copy[temp.order] = temp
        copy[temp2.order] = temp2

        let errored = false
        for (const t of copy) {
            errored = errored || !await this.saveTab(t)
        }
        if (errored) {
            alert("Failed to save data")
        }

        this.setState({
            tabs: copy
        })
    }

    async removeTab(tab) {
        if (confirm("Do you really want to delete the tab '" + tab.title + "'?")) {
            if (!await fetch("/api/delete/tab", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    _id: tab._id
                })
            }).then(r => {
                return r.status === 200
            })) {
                alert("Failed to delete tab '" + tab.title + "'")
            }
            let temp = this.state.tabs.filter(t => t._id !== tab._id)
            temp = await temp.map(async (t, i) => {
                t.order = i
                await this.saveTab(t)
                return t
            })

            this.setState({
                tables: temp
            })
        }
    }

    render() {
        return <div>
            {this.state.tabs.map(t => {
                return <TabRow tab={t} move={(sort) => this.moveTab(t, sort)}
                               remove={() => this.removeTab(t)}
                               key={t._id}/>
            })}
            <div className={styles.row + " card bg-2 my-2"}>
                <div className="row g-0">
                    <div className={styles.column + " col-auto p-1"}>
                        <Link href={"/edit/tab/_new"}>
                            <a title={"Create a new tab"} style={{
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
                                Create a new tab
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
