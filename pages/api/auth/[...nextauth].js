import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { addUser, getUser } from '../../../lib/db/users'

// TODO: migrate to v4 https://next-auth.js.org/getting-started/upgrade-v4
const discord = Providers.Discord({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
})
const nextAuth = NextAuth({
  providers: [discord],
  theme: {
    brandColor: '#0d6efd',
    logo: 'https://piracy.moe/icons/logo.png',
  },
  callbacks: {
    // we want to access the user id
    async session(session, user) {
      if (user) {
        const id = user.id.toString()
        session.user.uid = id

        const userData = await getUser(id)
        // create user account if not found
        if (userData === null) {
          console.log(
            'User ',
            user.name,
            ' (',
            id,
            ')could not be found, creating new user'
          )
          await addUser({
            uid: id,
            accountType: 'user',
          })

          session.user.accountType = 'user'
        } else {
          session.user.accountType = userData.accountType
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        console.log('Create new user', user.name)
        const accountType =
          typeof process.env.SETUP_WHITELIST_DISCORD_ID !== 'undefined' &&
          process.env.SETUP_WHITELIST_DISCORD_ID !== '' &&
          account.id === process.env.SETUP_WHITELIST_DISCORD_ID.toString()
            ? 'admin'
            : 'user'
        await addUser({
          uid: user.id.toString(),
          accountType,
        })
      }
    },
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL + '/index?entityPrefix=nextauth_',
  secret: process.env.NEXTAUTH_SECRET,
})

export default nextAuth
