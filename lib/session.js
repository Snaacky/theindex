export const canEdit = (session, type = "item") => {
    if (session && session.user) {
        if (session.user.accountType === "admin") {
            return true
        }
        return session.user.accountType === "editor" && type !== "user"
    }
    return false
}

export const isAdmin = (session) => {
    if (session && session.user) {
        return session.user.accountType === "admin"
    }
    return false
}

export const isCurrentUser = (session, uid) => {
    if (session && session.user) {
        return session.user.uid === uid
    }
    return false
}
