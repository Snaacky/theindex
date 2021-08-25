import Row from "./Row"

export default function ColumnRow(
    {
        column,
        add = null,
        remove = null,
        move = null
    }) {
    console.log("ColumnRow with column", column)
    return <Row type={"column"} content={column} add={add} remove={remove} move={move}/>
}
