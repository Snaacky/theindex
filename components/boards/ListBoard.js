import Board from "./Board"
import Loader from "../loading"
import Error from "../../pages/_error"
import useSWR from "swr"

export default function ListBoard(
    {
        uid,
        lists,
        updateURL = "",
        updateKey = "lists",
        deleteURL = "/api/delete/list",
        forceEditMode = false,
        canMove = false,
        canEdit = false
    }) {
    const {data: allLists, error} = useSWR("/api/lists")

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!allLists) {
        return <Loader/>
    }

    if (lists.length > 0 && typeof lists[0] === "string") {
        lists = lists.map(id => allLists.find(i => i._id === id)).filter(t => typeof t !== "undefined")
    }
    return <Board type={"list"} _id={uid} content={lists} allContent={allLists} updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove} canEdit={canEdit}/>
}
