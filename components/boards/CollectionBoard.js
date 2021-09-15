import Board from "./Board"
import Loader from "../loading"
import useSWR from "swr"

export default function CollectionBoard(
    {
        _id,
        collections,
        updateURL = "/api/edit/library",
        updateKey = "collections",
        deleteURL = "",
        forceEditMode = false,
        canMove = true,
        canEdit = false
    }) {
    const {data: allCollections} = useSWR("/api/collections")
    if (!allCollections) {
        return <Loader/>
    }

    if (collections.length > 0 && typeof collections[0] === "string") {
        collections = collections.map(id => allCollections.find(i => i._id === id)).filter(t => typeof t !== "undefined")
    }
    return <Board type={"collection"} _id={_id} content={collections} allContent={allCollections}
                  updateContentURL={updateURL}
                  updateContentKey={updateKey} deleteContentURL={deleteURL} forceEditMode={forceEditMode}
                  canMove={canMove} canEdit={canEdit}/>
}
