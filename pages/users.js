import Layout, {siteTitle} from "../components/layout/Layout"
import Head from "next/head"
import {getTabsWithTables} from "../lib/db/tabs"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {getUsers} from "../lib/db/users"
import UserCard from "../components/cards/UserCard"

export default function Users({tabs, users}) {
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
                </h2>
            </div>
        </div>

        {users.map(u => <UserCard user={u} key={u.uid}/>)}
    </Layout>
}

export async function getStaticProps() {
    return {
        props: {
            tabs: await getTabsWithTables(),
            users: await getUsers()
        },
        revalidate: 20
    }
}
