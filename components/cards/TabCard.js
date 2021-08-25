import Card from "./Card"

export default function TabCard(
    {
        tab,
        add = null,
        remove = null,
        move = null
    }) {
    return <Card type={"tab"} content={tab} add={add} remove={remove} move={move}/>
}
