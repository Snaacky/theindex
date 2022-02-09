import { AccountType } from './User'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      uid: string
      accountType: AccountType
    } & DefaultSession['user']
  }
}
