import Link from "next/link"
import Row from "./Row"
import ArrayValue from "../data/ArrayValue"
import BoolValue from "../data/BoolValue"

export default function ItemRow(
    {
        item,
        columns = [],
        add = null,
        remove = null,
        move = null
    }) {

    let columnYes = [], columnNo = [], columnArray = []
    columns.forEach(c => {
        if (c.type === "bool") {
            if (item.data[c._id] === true) {
                columnYes.push(c)
            } else if (item.data[c._id] === false) {
                columnNo.push(c)
            }
        } else if (c.type === "array" && (item.data[c._id] || []).length > 0) {
            columnArray.push(c)
        }
    })

    return <Row type={"item"} content={item} add={add} remove={remove} move={move} bodyContent={<>
        {columnYes.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {columnYes.map(c => <BoolValue data={true} column={c} key={c._id}/>)}
            </div> : <></>
        }
        {columnNo.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {columnNo.map(c => <BoolValue data={false} column={c} key={c._id}/>)}
            </div> : <></>
        }
        {columnArray.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {columnArray.map(c => {
                    return <div key={c._id}>
                        <Link href={"/column/" + c.urlId} key={c._id}>
                            <a className={"me-2"} title={"View column " + c.title}>
                                {c.title}:
                            </a>
                        </Link>
                        <ArrayValue data={item.data[c._id]} column={c}/>
                    </div>
                })}
            </div> : <></>
        }
    </>}/>
}
