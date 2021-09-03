import Row from "./Row"

export default function LibraryRow(
    {
        tab,
        move = null,
        add = null,
        remove = null
    }) {

    return <Row type={"library"} content={tab} move={move} add={add} remove={remove}/>
}
