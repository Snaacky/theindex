import CardRowBoard from "./CardRowBoard"

export default function TabBoard(
    {
        tabs,
        updateURL = "/api/edit/tab/order",
        updateKey = "tabs",
        deleteURL = "/api/delete/tab",
    }) {
    return <CardRowBoard type={"tab"} content={tabs} updateContentURL={updateURL}
                         updateContentKey={updateKey} deleteContentURL={deleteURL}/>
}
