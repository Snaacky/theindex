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

export const isEditor = (session) => {
    if (isLogin(session)) {
        return session.user.accountType === "editor" || isAdmin(session)
    }
    return false
}

export const isCurrentUser = (session, uid) => {
    if (isLogin(session)) {
        console.log("Checking if session!", session, "is user", uid, "result:", session.user.uid === uid)
        return session.user.uid === uid
    }
    return false
}
