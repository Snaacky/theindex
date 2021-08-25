import {deleteOne, findOne, getAll, insert, updateOne} from "./db"

export async function getUsers() {
    return await getAll("users")
}

export async function getUser(uid) {
    return await findOne("users", {uid})
}

export async function addUser({uid, accountType, description}) {
    if (!uid) {
        throw "Adding user and no uid specified"
    }

    return await insert("users", {
        uid,
        accountType: accountType || "",
        description: description || "",
    })
}

export async function updateUser({uid, accountType, description}) {
    if (!uid) {
        throw "Updating user and no uid specified"
    }

    let data = {}
    if (accountType) {
        data.accountType = accountType
    }
    if (description) {
        data.description = description
    }

    return await updateOne("users", {uid}, data)
}

export async function deleteUser(uid) {
    return await deleteOne("users", {uid})
}
