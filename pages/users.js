import Layout, {siteTitle} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {countUsers, getUsers} from "../lib/db/users"
import UserCard from "../components/cards/UserCard"
import DataBadge from "../components/data/DataBadge"

export default function Users({tabs, users, userCount}) {
    return <Layout tabs={tabs}>
        <Head>
            <title>
                {"Users | " + siteTitle}
            </title>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <FontAwesomeIcon icon={["fas", "users"]}/> The whole community
                    <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                        <DataBadge title={userCount + " registered users"} style={"primary"}/>
                    </div>
                </h2>
            </div>
        </div>

        <div className={"d-flex flex-wrap"}>
            {users.map(u => <UserCard user={u} key={u.uid}/>)}
        </div>
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
