import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import { addUser } from './lib/db/users'
import { AccountType, type User } from './types/User'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { dbClient } from './lib/db/db'
import type { NextAuthConfig } from 'next-auth'
import { findOneTyped } from './lib/db/dbTyped'
import { Types } from './types/Components'

export const authOptions: NextAuthConfig = {
  providers: [Discord],
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

        const userData = (await findOneTyped(Types.user, id)) as User | null
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
          }).catch((error) => {
            console.error(
              'Failed to add new user in session callback',
              user,
              'due to',
              error
            )
          })

          session.user.accountType = AccountType.user
        } else {
          session.user.accountType = userData.accountType ?? AccountType.user
        }
      } else {
        console.warn('session call with no user provided')
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (typeof user === 'undefined' || user === null) {
        console.error('Sign In event with no user provided:', user)
        return
      }

      if (isNewUser) {
        console.log('Creating new user', user.name)
        const accountType =
          typeof account !== 'undefined' &&
          account !== null &&
          typeof process.env.SETUP_WHITELIST_DISCORD_ID !== 'undefined' &&
          process.env.SETUP_WHITELIST_DISCORD_ID !== '' &&
          account.providerAccountId === process.env.SETUP_WHITELIST_DISCORD_ID
            ? AccountType.admin
            : AccountType.user
        if (typeof user.id !== 'undefined') {
          await addUser({
            uid: user.id.toString(),
            accountType,
          }).catch((error) => {
            console.error('Failed to add new user', user, 'due to', error)
          })
        } else {
          console.error('Unable to create new user', user, 'due to missing id')
        }
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

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)
