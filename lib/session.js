export const isLogin = (session) => {
    return session && session.user
}

export const canEdit = (session, type = "item") => {
    if (isLogin(session)) {
        if (session.user.accountType === "admin") {
            return true
        }
        return session.user.accountType === "editor" && type !== "user"
    }
    return false
}

export const isAdmin = (session) => {
    if (isLogin(session)) {
        return session.user.accountType === "admin"
    }
    return false
}

export const isCurrentUser = (session, uid) => {
    if (isLogin(session)) {
        return session.user.uid === uid
    }
    return false
}
