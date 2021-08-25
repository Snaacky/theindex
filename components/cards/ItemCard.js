import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./TableCard.module.css"
import BoolValue from "../data/BoolValue"
import ArrayValue from "../data/ArrayValue"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import IconEdit from "../icons/IconEdit"
import IconDelete from "../icons/IconDelete"
import IconAdd from "../icons/IconAdd"
import IconNewTabLink from "../icons/IconNewTabLink"

const noop = () => {
}

export default function ItemCard(
    {
        item,
        columns = [],
        add = noop,
        remove = noop
    }) {
    const [session] = useSession()

    let columnYes = [], columnNo = [], columnArray = []
    columns.forEach(c => {
        if (c.data) {
            c = c.data
        }
        if (c.type === "bool") {
            if (item.data[c._id] === true) {
                columnYes.push(c)
            } else if (item.data[c._id] === false) {
                columnNo.push(c)
            }
        } else if (c.type === "array") {
            columnArray.push(c)
        }
    })

    return <div className={styles.card + " card bg-2 mb-2 me-2"}>
        <div className={"card-body" +
        (columnYes.length > 0 || columnNo.length > 0 || columnArray.length > 0 ? " pb-1" : "")}>
            <h5 className={"card-title"}>
                <Link href={"/item/" + item._id}>
                    <a title={"View item " + item.title}>
                        {item.title}
                    </a>
                </Link>
                <IconNewTabLink url={item.urls[0]}/>
                {canEdit(session) ? <>
                    <Link href={"/edit/item/" + item._id}>
                        <a title={"Edit item"}>
                            <IconEdit/>
                        </a>
                    </Link>
                    {add !== noop ? <a title={"Add item"} className={"float-end"} onClick={add} style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginTop: "-0.5rem",
                        marginRight: "-0.5rem"
                    }}>
                        <IconAdd/>
                    </a> : <></>}
                    {remove !== noop ? <a title={"Delete item"} className={"float-end"} onClick={remove} style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginTop: "-0.5rem",
                        marginRight: "-0.5rem"
                    }}>
                        <IconDelete/>
                    </a> : <></>}
                </> : ""}
            </h5>

            <p className={styles.description + " card-text"}>
                {item.description}
            </p>
        </div>
        {columnYes.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnYes.map(c => {
                    return <BoolValue data={true} column={c} key={c._id}/>
                })}
            </div> : <></>
        }
        {columnNo.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnNo.map(c => {
                    return <BoolValue data={false} column={c} key={c._id}/>
                })}
            </div> : <></>
        }
        {columnArray.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnArray.map(c => {
                    return <div key={c._id}>
                        <Link href={"/column/" + c.urlId}>
                            <a className={"me-2"} title={"View column " + c.title}>
                                {c.title}:
                            </a>
                        </Link>
                        <ArrayValue data={item.data[c._id] || []} column={c} key={c._id}/>
                    </div>
                })}
            </div> : <></>
        }
        {columnYes.length > 0 || columnNo.length > 0 || columnArray.length > 0 ?
            <div className={"mt-3"}/> : <></>
        }
    </div>
}
