export const canEdit = (session) => {
    if (session && session.user) {
        // todo: add proper is editor validation, currently hardcoded _id from db
        return session.user.uid === "60edaac6ccb33d1090ea5f28"
    }
    return false
}
