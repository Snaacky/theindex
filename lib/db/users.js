import {deleteOne, findOne, getAll, insert, updateOne} from "./db"

async function gatherUserInfo(uid, user) {
    const data = await findOne("nextauth_users", {_id: uid})
    if (user === null) {
        user = {}
    }

    if (data !== null) {
        user.name = data.name
        user.image = data.image
    }
    return user
}

export async function getUsers() {
    const users = (await getAll("users")).map(u => {
        u.uid = u.uid.toString()
        return u
    })
    return await Promise.all(users.map(async u => await gatherUserInfo(u.uid, u)))
}

export async function getUser(uid) {
    if (typeof uid !== "string") {
        uid = uid.toString()
    }
    return await gatherUserInfo(uid, await findOne("users", {
        uid
    }))
}

export async function addUser({uid, accountType, description}) {
    if (!uid) {
        throw "Adding user and no uid specified"
    }

    if (typeof uid !== "string") {
        uid = uid.toString()
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

    if (typeof uid !== "string") {
        uid = uid.toString()
    }
    return await updateOne("users", {
        uid
    }, {
        accountType,
        description
    })
}

export async function deleteUser(uid) {
    if (typeof uid !== "string") {
        uid = uid.toString()
    }
    return await deleteOne("users", {
        uid
    })
}
