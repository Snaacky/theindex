import Link from "next/link"
import DataBadge from "./DataBadge";

const noop = () => {
}

export default function BoolValue({data, column, onChange = noop}) {
    if (onChange === noop) {
        return <Link href={"/column/" + column.urlId + "?v=false"}>
            <a className={"me-2"} title={"View column " + column.title}>
                <DataBadge data={data} title={column.title}/>
            </a>
        </Link>
    }

    return <a className={""} onClick={() => {
        if (typeof data === "boolean") {
            onChange(data ? false : null)
        } else {
            onChange(true)
        }
    }}>
        <DataBadge data={data} title={column.title}/>
    </a>
}
