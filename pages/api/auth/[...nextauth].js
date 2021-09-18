import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import {addUser, getUser} from "../../../lib/db/users"
import {findOne} from "../../../lib/db/db";

const discord = Providers.Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET
})
const nextAuth = NextAuth({
    providers: [
        discord
    ],
    callbacks: {
        // we want to access the user id
        async session(session, user) {
            if (user) {
                const {uid, accountType} = await getUser(user.id)
                session.user.uid = uid
                session.user.accountType = accountType
            }
            return session
        },
    },
    events: {
        async createUser(user) {
            const {providerAccountId} = await findOne("nextauth_accounts", {userId: user.id})
            console.log("Create new user", user.name, providerAccountId)
            const accountType = (
                typeof process.env.SETUP_WHITELIST_DISCORD_ID !== "undefined" &&
                process.env.SETUP_WHITELIST_DISCORD_ID !== "" &&
                providerAccountId === process.env.SETUP_WHITELIST_DISCORD_ID.toString() ?
                    "admin" : "user"
            )
            await addUser({
                uid: user.id.toString(),
                accountType
            })
        }
    },

    // A database is optional, but required to persist accounts in a database
    database: process.env.DATABASE_URL + "/index?entityPrefix=nextauth_",
    secret: process.env.NEXTAUTH_SECRET
})

export default nextAuth
