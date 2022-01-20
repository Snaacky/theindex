export const isLogin = (session) => {
  return session && session.user && session.user.uid
}

export const canEdit = (session, type = 'item') => {
  if (isLogin(session)) {
    if (session.user.accountType === 'admin') {
      return true
    }
    return session.user.accountType === 'editor' && type !== 'user'
  }
  return false
}

export const isAdmin = (session) => {
  if (isLogin(session)) {
    return session.user.accountType === 'admin'
  }
  return false
}

export const isEditor = (session) => {
  if (isLogin(session)) {
    return session.user.accountType === 'editor' || isAdmin(session)
  }
  return false
}

export const isCurrentUser = (session, uid) => {
  if (isLogin(session)) {
    return session.user.uid === uid || uid === 'me'
  }
  return false
}
