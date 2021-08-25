import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import {addUser, getUser} from "../../../lib/db/users"

const discord = Providers.Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET
})
const nextAuth = NextAuth({
    providers: [
        discord
    ],
    callbacks: {
        async signIn(user, account, profile) {
            const dbUser = await getUser(user.id)
            if (dbUser === null) {
                const accountType = (
                    typeof process.env.SETUP_WHITELIST_DISCORD_ID !== "undefined" &&
                    process.env.SETUP_WHITELIST_DISCORD_ID !== "" &&
                    profile.id === process.env.SETUP_WHITELIST_DISCORD_ID ?
                        "admin" : "user"
                )
                await addUser({
                    uid: user.id,
                    accountType
                })
            }
            return true
        },

        // we want to access the user id
        async session(session, user) {
            if (user) {
                session.user.uid = user.id
                const uData = await getUser(user.id)
                session.user.accountType = uData.accountType
                session.user.description = uData.description
            }
            return session
        },
        async jwt(token, user) {
            if (user) {
                token.uid = user.id
            }
            return token
        }
    },

    // A database is optional, but required to persist accounts in a database
    database: process.env.DATABASE_URL + "/index?entityPrefix=nextauth_",
})

export default nextAuth
