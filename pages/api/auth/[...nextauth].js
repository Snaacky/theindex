import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.Discord({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        // ...add more providers here
    ],
    callbacks: {
        //
        async signIn(user, account, profile) {
            console.log("Sign In event:", user, account, profile)
            return true
        },

        // we want to access the user id
        async session(session, user) {
            if (user) {
                session.user.uid = user.id
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
