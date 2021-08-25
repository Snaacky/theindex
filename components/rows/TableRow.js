import Row from "./Row"

export default function TableRow(
    {
        table,
        add = null,
        remove = null,
        move = null
    }) {

    return <Row type={"table"} content={table} add={add} remove={remove} move={move}
                imageUrl={table.img ? table.img : "/img/puzzled.png"}/>
}
