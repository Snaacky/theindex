import {count, deleteOne, find, findOne, getAll, insert, updateOne} from "./db"
import {getList} from "./lists"

export async function userExists(uid) {
    if (typeof uid !== "string") {
        uid = uid.toString()
    }
    return (await findOne("users", {
        uid
    })) !== null
}

async function gatherUserInfo(uid, user) {
    const data = await findOne("nextauth_users", {_id: uid})
    if (user === null && data === null) {
        return null
    }

    if (user === null) {
        user = {}
    }

    if (data !== null) {
        user.name = data.name
    }

    if (!user.image && data.image) {
        await updateUser(uid, {
            image: data.image
        })
        user.image = data.image
    }
    user.favs = user.favs || []
    user.lists = user.lists || []
    user.followLists = user.followLists || []
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

export async function addUser({uid, accountType, description, image}) {
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
        image: image || "https://avatars.dicebear.com/api/pixel-art/" + uid + ".svg",
        favs: [],
        lists: [],
        followLists: []
    })
}

export async function updateUser(uid, {accountType, description, image, favs, lists, followLists}) {
    if (!uid) {
        throw "Updating user and no uid specified"
    }

    if (typeof uid !== "string") {
        uid = uid.toString()
    }

    let data = {}
    if (accountType) {
        data.accountType = accountType
    }
    if (description) {
        data.description = description
    }
    if (image) {
        data.image = image
    }
    if (favs) {
        data.favs = favs
    }
    if (lists) {
        data.lists = lists
    }
    if (followLists) {
        data.followLists = followLists
    }
    console.log("updating user", uid, "with data", data)
    return await updateOne("users", {uid}, data)
}

export async function deleteUser(uid) {
    if (typeof uid !== "string") {
        uid = uid.toString()
    }

    return await deleteOne("users", {uid})
}

export async function countUsers() {
    return await count("users")
}

export async function getUserWithLists(uid) {
    const user = await getUser(uid)
    user.lists = await find("lists", {owner: user.uid})
    user.followLists = await Promise.all((user.followLists || []).map(async l => await getList(l)))
    return user
}
