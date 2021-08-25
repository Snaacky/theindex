export const canEdit = (session) => {
    if (session && session.user) {
        return session.user.accountType === "editor" || session.user.accountType === "admin"
    }
    return false
}

export const isAdmin = (session) => {
    if (session && session.user) {
        return session.user.accountType === "admin"
    }
    return false
}
