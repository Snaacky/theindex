import Row from "./Row"

export default function CollectionRow(
    {
        collection,
        add = null,
        remove = null,
        move = null
    }) {

    return <Row type={"collection"} content={collection} add={add} remove={remove} move={move}
                imageUrl={collection.img ? collection.img : "/img/puzzled.png"}/>
}
