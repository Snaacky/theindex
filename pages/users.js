import Layout, {siteName} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {countUsers, getUsers} from "../lib/db/users"
import DataBadge from "../components/data/DataBadge"
import UserBoard from "../components/boards/UserBoard"

export default function Users({tabs, users, userCount}) {
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Users | " + siteName}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <FontAwesomeIcon icon={["fas", "users"]}/> The whole community
                    <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                        <DataBadge name={userCount + " user" + (userCount > 1 ? "s" : "")} style={"primary"}/>
                    </div>
                </h2>
            </div>
        </div>

        <UserBoard users={users} allUsers={users}/>
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            users: await getUsers(),
            userCount: await countUsers(),
        },
        revalidate: 10
    }
}
