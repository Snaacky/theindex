import useSWR from "swr"
import Error from "../../pages/_error"

export default function EditSelectImg({selected, onChange}) {
    let {data: imgs, error} = useSWR("/api/imgs")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    imgs = imgs || [selected]
    return <select className="form-select" aria-label="Select image" aria-describedby={"createCollectionInputImageHelp"}
                   onChange={(e) => onChange(e.target.value)}>
        {imgs.map(i => <option selected={i === selected} value={i} key={i}>
            {i}
        </option>)}
    </select>
}
