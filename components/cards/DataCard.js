import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./TableCard.module.css"
import DataItem from "../data/DataItem"
import IconEdit from "../icons/IconEdit"

const noop = () => {
}

export default function DataCard(
    {
        data,
        column,
        onChange = noop
    }) {
    const [session] = useSession()

    return <div className={"card bg-4 mb-2 me-2"}>
        <div className={"card-body"}>
            <h5 className={"card-title"}>
                <Link href={"/column/" + column.urlId}>
                    <a title={"View column " + column.title}>
                        {column.title}
                    </a>
                </Link>
                {canEdit(session) ? <Link href={"/edit/column/" + column.urlId}>
                    <a title={"Edit column"}>
                        <IconEdit/>
                    </a>
                </Link> : ""}
            </h5>

            {onChange === noop ? <p className={styles.description + " card-text"}>
                {column.description}
            </p> : <></>}
            <DataItem data={data} column={column} onChange={onChange}/>
        </div>
    </div>
}