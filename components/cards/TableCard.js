import Card from "./Card"

export default function TableCard(
    {
        table,
        add = null,
        remove = null,
        move = null
    }) {

    return <Card type={"table"} content={table} add={add} remove={remove} move={move}
                 imageUrl={table.img ? table.img : "/img/puzzled.png"}/>
}
