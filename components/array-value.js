export default function ArrayValue({value, canEdit = false, onChange}) {
    return <div>
        {value.map(v => <div className={"btn btn-outline-success btn-sm mx-1"} key={v}>
            {v}
        </div>)}
    </div>
}
