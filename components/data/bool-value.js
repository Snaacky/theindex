import Link from "next/link"

export default function BoolValue({data, column, onChange}) {
    return <Link href={"/column/" + column.urlId + "?v=false"} key={column._id}>
        <a className={"me-2"} title={"View column " + column.title}>
            <div className={"badge rounded-pill bg-" +
            (data === true ? "success" : (data === false ? "danger" : "secondary"))}>
                {column.title}
            </div>
        </a>
    </Link>
}
