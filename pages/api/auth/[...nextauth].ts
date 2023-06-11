import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { addUser, getUser } from '../../../lib/db/users'
import { AccountType } from '../../../types/User'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { dbClient } from '../../../lib/db/db'
import { ObjectId } from 'mongodb'
import type { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'dark',
    brandColor: '#0d6efd',
    logo: process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png',
  },
  callbacks: {
    // we want to access the user id
    async session({ session, user }) {
      if (user) {
        const id = user.id.toString()
        session.user.uid = id

        const userData = await getUser(id)
        // create user account if not found
        if (userData === null) {
          console.log(
            'User',
            user.name,
            id,
            'could not be found, creating new user'
          )
          await addUser({
            uid: id,
            accountType: AccountType.user,
          })

          session.user.accountType = AccountType.user
        } else {
          session.user.accountType = userData.accountType
        }
      } else {
        console.warn('session call with no user provided')
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log('Creating new user', user.name)
        const accountType =
          typeof process.env.SETUP_WHITELIST_DISCORD_ID !== 'undefined' &&
          process.env.SETUP_WHITELIST_DISCORD_ID !== '' &&
          account.providerAccountId === process.env.SETUP_WHITELIST_DISCORD_ID
            ? AccountType.admin
            : AccountType.user
        await addUser({
          uid: user.id.toString(),
          accountType,
        })
      } else if (user.image !== profile.image) {
        // update new discord image on login
        const db = (await dbClient).db('index')
        await db.collection('nextauth_users').updateOne(
          { _id: new ObjectId(user.id) },
          {
            $set: {
              image: profile.image,
            },
          }
        )
      }
    },
  },

  // A database is optional, but required to persist accounts in a database
  adapter: MongoDBAdapter(dbClient, {
    collections: {
      Users: 'nextauth_users',
      Sessions: 'nextauth_sessions',
      Accounts: 'nextauth_accounts',
    },
  }),
  secret: process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)
