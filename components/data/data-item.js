import BoolValue from "./bool-value"
import ArrayValue from "./array-value"

const noop = () => {
}

export default function DataItem({data, column, onChange = noop}) {
    if (column.type === "bool") {
        return <BoolValue data={data} column={column} onChange={onChange}/>
    } else if (column.type === "array") {
        return <ArrayValue data={data} column={column} onChange={onChange}/>
    } else if (column.type === "text") {
        return data
    } else {
        console.error("Unknown type of column:", column)
    }
}
