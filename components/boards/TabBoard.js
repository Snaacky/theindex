import CardRowBoard from "./CardRowBoard"

export default function TabBoard(
    {
        tabs,
        deleteURL = "/api/delete/tab",
    }) {
    return <CardRowBoard type={"tab"} content={tabs} deleteContentURL={deleteURL}/>
}
