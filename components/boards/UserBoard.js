import Board from "./Board"

export default function UserBoard(
    {
        _id,
        users,
        allUsers,
        updateURL = "",
        updateKey = "",
        deleteURL = "/api/delete/user",
        forceEditMode = false,
        canMove = true
    }) {
    return <Board type={"user"} _id={_id} content={users} allContent={allUsers} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove}/>
}
