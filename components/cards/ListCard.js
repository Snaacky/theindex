import Card from "./Card"

export default function ListCard(
    {
        list,
        add = null,
        remove = null,
        move = null
    }) {

    return <Card type={"list"} content={list} add={add} remove={remove} move={move}/>
}
