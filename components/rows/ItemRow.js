import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./TableRow.module.css"
import IconAdd from "../icons/IconAdd"
import IconDelete from "../icons/IconDelete"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import IconEdit from "../icons/IconEdit"

const noop = () => {
}

export default function ItemRow(
    {
        item,
        columns = [],
        className = "bg-2",
        move = noop,
        add = noop,
        remove = noop
    }) {
    const [session] = useSession()

    let columnYes = [], columnNo = [], columnUnknown = [], columnArray = []
    columns.forEach(c => {
        c = c.data
        if (c.type === "bool") {
            if (item.data[c._id] === true) {
                columnYes.push(c)
            } else if (item.data[c._id] === false) {
                columnNo.push(c)
            } else {
                columnUnknown.push(c)
            }
        } else if (c.type === "array") {
            columnArray.push(c)
        }
    })

    return <div className={styles.row + " card mb-2 " + className}>
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
                    <a onClick={add} title={"Add item"} style={{
                        height: "32px"
                    }}>
                        <IconAdd/>
                    </a>
                </div> : <></>
            }
            <div className="col">
                <div className={"card-body" +
                (columnYes.length > 0 || columnUnknown.length > 0 || columnNo.length > 0 || columnArray.length > 0 ? " pb-1" : "")}>
                    <h5 className={"card-title"}>
                        <Link href={"/item/" + item._id}>
                            <a title={"View item " + item.title}>
                                {item.title}
                            </a>
                        </Link>
                        <a className={"mx-2"} target={"_blank"} href={item.urls[0]} rel="noreferrer"
                           title={"Open in new tab"}>
                            <FontAwesomeIcon icon={["fas", "external-link-alt"]}/>
                        </a>
                        {canEdit(session) ? <Link href={"/edit/item/" + item._id}>
                            <a title={"Edit item"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                    </h5>

                    <p className={styles.description + " card-text"}>
                        {item.description}
                    </p>
                </div>
            </div>
            {canEdit(session) && remove !== noop ?
                <div className={styles.column + " col-auto p-1"}>
                    <a onClick={remove} title={"Remove item"} className={"float-end"} style={{
                        width: "42px",
                        height: "42px"
                    }}>
                        <IconDelete/>
                    </a>
                </div> : ""}
        </div>
        {columnYes.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnYes.map(c => {
                    return <Link href={"/column/" + c.urlId + "?v=true"} key={c._id}>
                        <a className={"me-2"} title={"View column " + c.title}>
                            <div className={"badge rounded-pill bg-success"}>
                                {c.title}
                            </div>
                        </a>
                    </Link>
                })}
            </div> : <></>
        }
        {columnUnknown.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnUnknown.map(c => {
                    return <Link href={"/column/" + c.urlId + "?v=unknown"} key={c._id}>
                        <a className={"me-2"} title={"View column " + c.title}>
                            <div className={"badge rounded-pill bg-secondary"}>
                                {c.title}
                            </div>
                        </a>
                    </Link>
                })}
            </div> : <></>
        }
        {columnNo.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnNo.map(c => {
                    return <Link href={"/column/" + c.urlId + "?v=false"} key={c._id}>
                        <a className={"me-2"} title={"View column " + c.title}>
                            <div className={"badge rounded-pill bg-danger"}>
                                {c.title}
                            </div>
                        </a>
                    </Link>
                })}
            </div> : <></>
        }
        {columnArray.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnArray.map(c => {
                    return <div key={c._id}>
                        <Link href={"/column/" + c.urlId} key={c._id}>
                            <a className={"me-2"} title={"View column " + c.title}>
                                {c.title}:
                            </a>
                        </Link>
                        {(item.data[c._id] || []).map(v => {
                            return <Link href={"/column/" + c.urlId + "?v=" + v} key={v}>
                                <a className={"me-2"} title={"View column " + c.title + " with value " + v}>
                                    <div className={"badge rounded-pill bg-secondary"}>
                                        {v}
                                    </div>
                                </a>
                            </Link>
                        })}
                    </div>
                })}
            </div> : <></>
        }
        {columnYes.length > 0 || columnUnknown.length > 0 || columnNo.length > 0 || columnArray.length > 0 ?
            <div className={"mt-3"}/> : <></>
        }
    </div>
}
