import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./TableRow.module.css"
import IconDelete from "../icons/IconDelete"
import IconEdit from "../icons/IconEdit"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const noop = () => {
}

export default function TabRow(
    {
        tab,
        className = "bg-2",
        move = noop,
        remove = noop
    }) {
    const [session] = useSession()

    return <div className={styles.row + " card my-2 " + className}>
        <div className="row g-0">
            {canEdit(session) && move !== noop ?
                <div className={styles.sorter + " col-auto"}>
                    <a onClick={() => move(-1)} style={{
                        cursor: "pointer"
                    }}
                       className={"w-100 h-100 d-flex justify-content-center align-items-center"}>
                        <FontAwesomeIcon icon={["fas", "chevron-up"]}/>
                    </a>
                    <a onClick={() => move(1)} style={{
                        cursor: "pointer"
                    }}
                       className={"w-100 h-100 d-flex justify-content-center align-items-center"}>
                        <FontAwesomeIcon icon={["fas", "chevron-down"]}/>
                    </a>
                </div> : <></>
            }
            <div className="col">
                <div className={"card-body"}>
                    <h5 className={"card-title"}>
                        <Link href={"/tab/" + tab.urlId}>
                            {tab.title}
                        </Link>
                        {canEdit(session) ? <Link href={"/edit/tab/" + tab.urlId}>
                            <a title={"Edit tab"} className={"ms-2"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                    </h5>

                    <p className={styles.description + " card-text"}>
                        {tab.description}
                    </p>
                </div>
            </div>
            {canEdit(session) && remove !== noop ?
                <div className={styles.column + " col-auto p-1"}>
                    <a onClick={remove} title={"Remove tab"} className={"float-end"} style={{
                        width: "42px",
                        height: "42px"
                    }}>
                        <IconDelete/>
                    </a>
                </div> : ""}
        </div>
    </div>
}
