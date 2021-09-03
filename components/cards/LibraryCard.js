import Card from "./Card"

export default function LibraryCard(
    {
        tab,
        add = null,
        remove = null,
        move = null
    }) {
    return <Card type={"library"} content={tab} add={add} remove={remove} move={move}/>
}
