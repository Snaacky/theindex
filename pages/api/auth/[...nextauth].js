import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import {addUser, getUser, userExists} from "../../../lib/db/users"
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
                session.user.uid = user.id
                if (!(await userExists(user.id))) {
                    const accountData = await findOne("nextauth_accounts", {userId: user.id})
                    const accountType = (
                        typeof process.env.SETUP_WHITELIST_DISCORD_ID !== "undefined" &&
                        process.env.SETUP_WHITELIST_DISCORD_ID !== "" &&
                        accountData.providerAccountId === process.env.SETUP_WHITELIST_DISCORD_ID.toString() ?
                            "admin" : "user"
                    )
                    await addUser({
                        uid: user.id,
                        accountType
                    })
                }
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
