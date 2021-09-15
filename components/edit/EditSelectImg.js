import useSWR from "swr"

export default function EditSelectImg({selected, onChange}) {
    let {data: imgs} = useSWR("/api/imgs")

    imgs = imgs || [selected]
    return <select className="form-select" aria-label="Select image" aria-describedby={"createCollectionInputImageHelp"}
                   onChange={(e) => onChange(e.target.value)}>
        {imgs.map(i => <option selected={i === selected} value={i} key={i}>
            {i}
        </option>)}
    </select>
}
