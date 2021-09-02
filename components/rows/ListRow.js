import Row from "./Row"

export default function ListRow(
    {
        list,
        add = null,
        remove = null,
        move = null
    }) {

    return <Row type={"list"} content={list} add={add} remove={remove} move={move}/>
}
