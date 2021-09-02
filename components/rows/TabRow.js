import Row from "./Row"

export default function TabRow(
    {
        tab,
        move = null,
        add = null,
        remove = null
    }) {

    return <Row type={"tab"} content={tab} move={move} add={add} remove={remove}/>
}
