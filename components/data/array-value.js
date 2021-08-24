import Link from "next/link"

export default function ArrayValue({data, column, onChange}) {
    return <div>
        <Link href={"/column/" + column.urlId}>
            <a className={"me-2"} title={"View column " + column.title}>
                {column.title}:
            </a>
        </Link>
        {data.map(v => <Link href={"/column/" + column.urlId + "?v=" + v} key={v}>
            <a className={"me-2"} title={"View column " + column.title + " with value " + v}>
                <div className={"badge rounded-pill bg-secondary"}>
                    {v}
                </div>
            </a>
        </Link>)}
    </div>
}
