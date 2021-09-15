import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import DataBadge from "../components/data/DataBadge"
import UserBoard from "../components/boards/UserBoard"
import useSWR from "swr"
import {getUsers} from "../lib/db/users"

export default function Users({users: staticUsers}) {
    let {data: users} = useSWR("/api/users")
    users = users || staticUsers

    const description = "Listing of all registered users"
    return <>
        <Head>
            <title>
                {"Users | " + siteName}
            </title>
            <meta name={"description"} content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Users on The Anime Index"}/>
            <meta name="twitter:description" content={"View all registered users"}/>
        </Head>

        <h2>
            <FontAwesomeIcon icon={["fas", "users"]}/> The whole community
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge name={users.length + " user" + (users.length !== 1 ? "s" : "")} style={"primary"}/>
            </div>
        </h2>
        <p>
            {description}
        </p>

        <UserBoard users={users} allUsers={users}/>
    </>
}

export async function getStaticProps() {
    const users = await getUsers()
    return {
        props: {
            users
        },
        revalidate: 30
    }
}
