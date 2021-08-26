import CardRowBoard from "./CardRowBoard"

export default function UserBoard(
    {
        _id,
        users,
        allUsers,
        updateURL = "",
        updateKey = "",
        deleteURL = "/api/delete/user",
    }) {
    return <CardRowBoard type={"user"} _id={_id} content={users} allContent={allUsers} updateContentURL={updateURL}
                         updateContentKey={updateKey} deleteContentURL={deleteURL}/>
}
