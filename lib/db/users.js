import {ObjectId} from "mongodb"
import {deleteOne, findOne, getAll, insert, updateOne} from "./db"

async function gatherUserInfo(user) {
    const data = await findOne("nextauth_users", {_id: user.uid})
    user.name = data.name
    user.image = data.image
    return user
}

export async function getUsers() {
    const users = (await getAll("users")).map(u => {
        u.uid = u.uid.toString()
        return u
    })
    return await Promise.all(users.map(async u => await gatherUserInfo(u)))
}

export async function getUser(uid) {
    if (typeof uid === "string") {
        uid = ObjectId(uid)
    }
    return await gatherUserInfo(await findOne("users", {uid}))
}

export async function addUser({uid, accountType, description}) {
    if (!uid) {
        throw "Adding user and no uid specified"
    }

    if (typeof uid === "string") {
        uid = ObjectId(uid)
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

    if (typeof uid === "string") {
        uid = ObjectId(uid)
    }

    return await updateOne("users", {uid}, {
        accountType,
        description
    })
}

export async function deleteUser(uid) {
    if (typeof uid === "string") {
        uid = ObjectId(uid)
    }
    return await deleteOne("users", {uid})
}
