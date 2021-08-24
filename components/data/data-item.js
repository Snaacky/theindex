import BoolValue from "./bool-value"
import ArrayValue from "./array-value"

export default function DataItem({data, column, onChange}) {
    return <div className={"d-inline-flex"} style={{
        verticalAlign: "middle"
    }}>
        {column.type === "array" ?
            <ArrayValue data={data} column={column} onChange={onChange}/>
            : <BoolValue data={data} column={column} onChange={onChange}/>
        }
    </div>
}
