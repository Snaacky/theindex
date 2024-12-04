import { Session } from 'next-auth'

export const isLogin = (session: Session | null) => {
  return (
    typeof session !== 'undefined' &&
    session !== null &&
    session.user &&
    session.user.uid
  )
}

export const canEdit = (session: Session | null, type = 'item') => {
  if (isLogin(session) && session !== null) {
    if (session.user.accountType === 'admin') {
      return true
    }
    return session.user.accountType === 'editor' && type !== 'user'
  }
  return false
}

export const isAdmin = (session: Session | null) => {
  if (isLogin(session) && session !== null) {
    return session.user.accountType === 'admin'
  }
  return false
}

export const isEditor = (session: Session | null) => {
  if (isLogin(session) && session !== null) {
    return session.user.accountType === 'editor' || isAdmin(session)
  }
  return false
}

export const isCurrentUser = (session: Session | null, uid) => {
  if (isLogin(session) && session !== null) {
    return session.user.uid === uid || uid === 'me'
  }
  return false
}
