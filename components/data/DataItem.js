import BoolValue from "./BoolValue"
import ArrayValue from "./ArrayValue"
import TextValue from "./TextValue"

export default function DataItem({data, column, onChange = null}) {
    if (column.type === "bool") {
        return <BoolValue data={data} column={column} onChange={onChange}/>
    } else if (column.type === "array") {
        return <ArrayValue data={data || []} column={column} onChange={onChange}/>
    } else if (column.type === "text") {
        return <TextValue data={data || ""} column={column} onChange={onChange}/>
    } else {
        console.error("Unknown type of column:", column)
    }
}
