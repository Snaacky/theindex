import Image from "next/image"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./TableRow.module.css"
import IconAdd from "../icons/IconAdd"
import IconDelete from "../icons/IconDelete"
import IconEdit from "../icons/IconEdit"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const noop = () => {
}

export default function TableRow(
    {
        table,
        move = noop,
        add = noop,
        remove = noop
    }) {
    const [session] = useSession()

    return <div className={styles.row + " card bg-2 my-2"}>
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
            {canEdit(session) && add !== noop ?
                <div className={styles.sorter + " col-auto"}>
                    <a onClick={add} title={"Add table"} style={{
                        height: "32px"
                    }}>
                        <IconAdd/>
                    </a>
                </div> : <></>
            }
            <div className={styles.column + " col-auto p-1"}>
                <Image src={table.img ? table.img : "/img/puzzled.png"} className="img-fluid rounded-start"
                       alt="..." width={64} height={64}/>
            </div>
            <div className="col">
                <div className={"card-body"}>
                    <h5 className={"card-title"}>
                        <Link href={"/table/" + table.urlId}>
                            {table.title}
                        </Link>
                        {canEdit(session) ? <Link href={"/edit/table/" + table.urlId}>
                            <a title={"Edit table"} className={"ms-2"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                    </h5>

                    <p className={styles.description + " card-text"}>
                        {table.description}
                    </p>
                </div>
            </div>
            {canEdit(session) && remove !== noop ?
                <div className={styles.column + " col-auto p-1"}>
                    <a onClick={remove} title={"Remove table"} className={"float-end"} style={{
                        width: "42px",
                        height: "42px"
                    }}>
                        <IconDelete/>
                    </a>
                </div> : ""}
        </div>
    </div>
}
